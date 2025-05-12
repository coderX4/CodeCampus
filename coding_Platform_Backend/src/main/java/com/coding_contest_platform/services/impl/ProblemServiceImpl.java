package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.problem.ActiveProblemDTO;
import com.coding_contest_platform.dto.problem.ProblemRequest;
import com.coding_contest_platform.entity.*;
import com.coding_contest_platform.repository.*;
import com.coding_contest_platform.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemSequenceRepository problemSequenceRepository;
    private final ProblemDataRepository problemDataRepository;
    private final ProblemTestCaseRepository problemTestCaseRepository;
    private final UserSubmissionsRepository userSubmissionsRepository;
    private final ProblemTagsListRepository problemTagsListRepository;

    @Override
    public String generateCustomId(String difficulty, List<String> tags) {
        // Step 1: Generate Prefix (e.g., "EABG")
        String diffLetter = difficulty.substring(0, 1).toUpperCase();
        String tagLetters = tags.stream()
                .limit(3)
                .map(tag -> tag.substring(0, 1).toUpperCase())
                .reduce("", String::concat);
        String prefix = diffLetter + tagLetters;

        // Step 2: Fetch and Update Sequence Number
        ProblemSequence sequence = problemSequenceRepository.findById(prefix).orElse(new ProblemSequence(prefix, 0));
        int nextNumber = sequence.getSequence() + 1;
        sequence.setSequence(nextNumber);
        problemSequenceRepository.save(sequence);

        // Step 3: Generate ID (e.g., "EABG001")
        return prefix + String.format("%03d", nextNumber);
    }

    // Create a new problem
    @Transactional
    @Override
    public ProblemRequest createProblem(ProblemRequest problemRequest) {

        // Generate unique ID before saving
        String customId = generateCustomId(problemRequest.getDifficulty(), problemRequest.getTags());
        //Generate date
        LocalDate date = LocalDate.now(); // Get current date
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Define format
        String formattedDate = date.format(dateFormatter);

        Problem problem = new Problem(
                customId,problemRequest.getTitle(),problemRequest.getDifficulty(),
                problemRequest.getTags(),"0 %",0,0,
                formattedDate,problemRequest.getStatus()
        );

        ProblemData problemData = new ProblemData(
                customId,
                problemRequest.getDescription(),
                problemRequest.getApproach(),
                problemRequest.getCodeTemplates()
        );

        ProblemTestCase problemTestCase = new ProblemTestCase(
                customId,
                problemRequest.getTestCases()
        );
        // Save problem in DB
        problemRepository.save(problem);

        problemDataRepository.save(problemData);

        problemTestCaseRepository.save(problemTestCase);

        //Problem Tag List
        assignProblemToTagsList(problemRequest.getTags());

        return problemRequest;
    }


    private void assignProblemToTagsList(List<String> tags){
        ProblemTagsList problemTagsList = problemTagsListRepository.findOneById("1");
        Map<String, Integer> mapProblemTagsList = problemTagsList.getProblemTagsList();
        for (String tag : tags) {
            mapProblemTagsList.put(tag, mapProblemTagsList.get(tag) + 1);
        }
        problemTagsList.setProblemTagsList(mapProblemTagsList);
        problemTagsListRepository.save(problemTagsList);
    }

    @Override
    public List<Problem> getProblems() {
        return problemRepository.findAll();
    }

    @Transactional
    @Override
    public void deleteProblem(String id) {
        Problem problem = problemRepository.findOneById(id);
        ProblemData problemData = problemDataRepository.findOneById(id);
        ProblemTestCase problemTestCase = problemTestCaseRepository.findOneById(id);
        problemRepository.delete(problem);
        problemDataRepository.delete(problemData);
        problemTestCaseRepository.delete(problemTestCase);
    }

    @Transactional
    @Override
    public ProblemRequest updateProblem(String id, ProblemRequest problemRequest) {
        Problem problem = problemRepository.findOneById(id);
        problem.setTitle(problemRequest.getTitle());
        if (!problemRequest.getDifficulty().isEmpty()) {
            problem.setDifficulty(problemRequest.getDifficulty());
        }
        problem.setTags(problemRequest.getTags());
        if(!problemRequest.getStatus().isEmpty()) {
            problem.setStatus(problemRequest.getStatus());
        }

        problemRepository.save(problem);

        ProblemData problemData = problemDataRepository.findOneById(id);
        problemData.setDescription(problemRequest.getDescription());
        problemData.setApproach(problemRequest.getApproach());
        problemData.setCodeTemplates(problemRequest.getCodeTemplates());
        problemDataRepository.save(problemData);

        ProblemTestCase problemTestCase = problemTestCaseRepository.findOneById(id);
        problemTestCase.setTestCases(problemRequest.getTestCases());
        problemTestCaseRepository.save(problemTestCase);

        assignProblemToTagsList(problem.getTags());

        return problemRequest;
    }

    @Override
    public ProblemData getProblemData(String id) {
        return problemDataRepository.findOneById(id);
    }

    @Override
    public ProblemTestCase getProblemTestCase(String id) {
        return problemTestCaseRepository.findOneById(id);
    }

    @Override
    public List<Problem> getActiveProblems() {
        return problemRepository.findByStatus("active");
    }

    @Override
    public void saveSubmission(String id, boolean isAccepted) {
        Problem problem = problemRepository.findOneById(id);
        problem.setSubmissions(problem.getSubmissions() + 1);
        if(isAccepted){
            problem.setAcceptedSubmissions(problem.getAcceptedSubmissions() + 1);
        }
        float rate = Math.round(((float) problem.getAcceptedSubmissions() / problem.getSubmissions()) * 10000) / 100f;
        problem.setAcceptance(String.format("%.2f", rate) + " %");
        problemRepository.save(problem);
    }

    private ActiveProblemDTO getActiveProblemDTO(Problem problem, List<String> problemsSolved, List<String> problemsAttempted) {
        ActiveProblemDTO activeProblemDTO = new ActiveProblemDTO();
        activeProblemDTO.setId(problem.getId());
        activeProblemDTO.setTitle(problem.getTitle());
        activeProblemDTO.setDifficulty(problem.getDifficulty());
        activeProblemDTO.setTags(problem.getTags());
        activeProblemDTO.setAcceptance(problem.getAcceptance());
        activeProblemDTO.setStatus(problem.getStatus());
        if(problemsSolved.contains(problem.getId())){
            activeProblemDTO.setSolved(true);
            activeProblemDTO.setAttempted(false);
        }
        else if(problemsAttempted.contains(problem.getId())){
            activeProblemDTO.setAttempted(true);
            activeProblemDTO.setSolved(false);
        }
        else{
            activeProblemDTO.setAttempted(false);
            activeProblemDTO.setSolved(false);
        }
        return activeProblemDTO;
    }

    @Override
    public List<ActiveProblemDTO> getActiveProblems(String email) {
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        List<String> problemsSolved, problemsAttempted;
        if(userSubmissions == null){
            problemsSolved = new ArrayList<>();
            problemsAttempted = new ArrayList<>();
        }
        else{
            problemsSolved = userSubmissions.getProblemsSolved();
            problemsAttempted = userSubmissions.getProblemAttempted();
        }
        List<Problem> problems = problemRepository.findByStatus("active");
        List<ActiveProblemDTO> activeProblemDTOList = new ArrayList<>();
        for (Problem problem : problems) {
            ActiveProblemDTO activeProblemDTO = getActiveProblemDTO(problem, problemsSolved, problemsAttempted);
            activeProblemDTOList.add(activeProblemDTO);
        }
        return activeProblemDTOList;
    }

}
