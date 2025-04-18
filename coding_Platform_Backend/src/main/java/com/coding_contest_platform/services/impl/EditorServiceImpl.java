package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.editor.EditorResponse;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.problem.TestCase;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemData;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.repository.ProblemDataRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.repository.ProblemTestCaseRepository;
import com.coding_contest_platform.services.EditorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class EditorServiceImpl implements EditorService {

    private final ProblemRepository problemRepository;
    private final ProblemDataRepository problemDataRepository;
    private final ProblemTestCaseRepository problemTestCaseRepository;

    @Value("${piston.java.version}")
    private String javaVersion;
    @Value("${piston.c.version}")
    private String cVersion;
    @Value("${piston.cpp.version}")
    private String cppVersion;

    private static final String PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";
    private final RestTemplate restTemplate = new RestTemplate();


    @Override
    public EditorResponse getProblem(String id) {
        Problem problem = problemRepository.findOneById(id);
        ProblemData problemData = problemDataRepository.findOneById(id);
        ProblemTestCase problemTestCase = problemTestCaseRepository.findOneById(id);
        return new EditorResponse(
                id,
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getAcceptance(),
                problemData.getDescription(),
                problemData.getApproach(),
                problemData.getCodeTemplates(),
                problemTestCase.getTestCases()
        );
    }

    @Override
    public List<ExecutionResponse> parallelExecutor(String code, String language, List<TestCase> testCases) throws InterruptedException ,ExecutionException{

        BlockingQueue<Callable<ExecutionResponse>> taskQueue2 = new LinkedBlockingQueue<>();
        ExecutorService resultCollector = Executors.newFixedThreadPool(testCases.size());
        List<Future<ExecutionResponse>> scheduledFutures = Collections.synchronizedList(new ArrayList<>());

        // Prepare tasks
        for (TestCase testCase : testCases) {
            taskQueue2.add(() -> executeSingleTestCase(
                    code, language, testCase
            ));
        }

        // Schedule tasks one-by-one every 210ms
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        final AtomicInteger completed = new AtomicInteger(0);
        int totalTasks = taskQueue2.size();

        scheduler.scheduleAtFixedRate(() -> {
            Callable<ExecutionResponse> task = taskQueue2.poll();
            if (task != null) {
                try {
                    ExecutionResponse result = task.call(); // <-- direct call ensures spacing!
                    synchronized (scheduledFutures) {
                        scheduledFutures.add(CompletableFuture.completedFuture(result));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            if (completed.incrementAndGet() >= totalTasks) {
                scheduler.shutdown();
            }
        }, 0, 210, TimeUnit.MILLISECONDS);


        // Wait for scheduler to finish
        scheduler.awaitTermination(10, TimeUnit.SECONDS);

        // Gather results
        List<ExecutionResponse> finalResults = new ArrayList<>();
        for (Future<ExecutionResponse> future : scheduledFutures) {
            finalResults.add(future.get());
        }

        resultCollector.shutdown();
        return finalResults;
    }

    public ExecutionResponse executeSingleTestCase(String code, String language, TestCase testCase) {
        String version;
        if(language.equals("java")) {
            version = javaVersion;
            language = "java";
        }
        else if(language.equals("cpp")) {
            version = cppVersion;
            language = "c++";
        }
        else{
            version = cVersion;
            language = "c";
        }

        // Create request payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("language", language);
        payload.put("version", version);
        payload.put("files", List.of(Map.of("name", "Main." + language, "content", code)));
        payload.put("stdin", testCase.getInput());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        // Call Piston API
        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(PISTON_API_URL, HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Piston API error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            return new ExecutionResponse(testCase.getInput(), testCase.getExpectedOutput(), "", false, "API Error: " + e.getMessage());
        }

        // Extract response
        Map<String, Object> runData = (Map<String, Object>) response.getBody().get("run");
        String output = (runData != null && runData.get("output") != null) ? runData.get("output").toString().trim() : "Execution failed";
        String error = (runData != null && runData.get("stderr") != null) ? runData.get("stderr").toString().trim() : "";

        // Compare output with expected
        return new ExecutionResponse(testCase.getInput(), testCase.getExpectedOutput(), output, output.equals(testCase.getExpectedOutput()), error);
    }
}
