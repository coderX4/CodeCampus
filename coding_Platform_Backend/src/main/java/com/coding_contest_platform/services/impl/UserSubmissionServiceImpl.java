package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.MainSectionDTO;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.entity.UserSubmissions;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.repository.UserSubmissionsRepository;
import com.coding_contest_platform.services.UserSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserSubmissionServiceImpl implements UserSubmissionService {
    private final UserSubmissionsRepository userSubmissionsRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    @Override
    public List<SubmissionDTO> getSubmissions(String email, String id){
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        if(userSubmissions == null){
            return new ArrayList<>();
        }
        return userSubmissions.getSubmission().get(id);
    }

    public int assignPoints(String difficulty){
        return switch (difficulty) {
            case "easy" -> 10;
            case "medium" -> 20;
            case "hard" -> 30;
            default -> 0;
        };
    }

    @Override
    public boolean saveSubmissions(String email, String pId, List<ExecutionResponse> executionResponseList, String language, String code){
        User user = userRepository.findByEmail(email);
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        String difficulty = problemRepository.findOneById(pId).getDifficulty();
        LocalDateTime dateTime = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy [HH:mm:ss]");
        String formattedDateTime = dateTime.format(formatter);
        SubmissionDTO submissionDTO = new SubmissionDTO();
        submissionDTO.setDateTime(formattedDateTime);
        submissionDTO.setLanguage(language);
        submissionDTO.setCode(code);
        submissionDTO.setExecutionResponse(executionResponseList);
        int cnt = 0;
        for(ExecutionResponse executionResponse : executionResponseList){
            if(executionResponse.isCorrect()){
                cnt++;
            }
        }
        submissionDTO.setAccepted(cnt == executionResponseList.size());
        if(userSubmissions == null){
            userSubmissions = new UserSubmissions();
            userSubmissions.setEmail(email);

            List<SubmissionDTO> submissionDTOList = new ArrayList<>();
            submissionDTOList.add(submissionDTO);
            Map<String, List<SubmissionDTO>> submission = new HashMap<>();
            submission.put(pId, submissionDTOList);
            userSubmissions.setSubmission(submission);

            int score = 0;
            List<String> problemSolved = new ArrayList<>();
            List<String> problemAttempted = new ArrayList<>();
            if(submissionDTO.isAccepted()){
                score = assignPoints(difficulty);
                problemSolved.add(pId);

                user.setProblems(problemSolved.size());
                user.setProblemFinalScore(score);
                userRepository.save(user);
            }
            else{
                problemAttempted.add(pId);
            }
            userSubmissions.setProblemsSolved(problemSolved);
            userSubmissions.setProblemAttempted(problemAttempted);
            userSubmissionsRepository.save(userSubmissions);
            return submissionDTO.isAccepted();
        }
        else{
            Map<String, List<SubmissionDTO>> submission = userSubmissions.getSubmission();
            int score = user.getProblemFinalScore();
            List<String> problemSolved = userSubmissions.getProblemsSolved();
            List<String> problemAttempted = userSubmissions.getProblemAttempted();
            if(submission.containsKey(pId)){
                List<SubmissionDTO> submissionDTOList = submission.get(pId);
                submissionDTOList.add(submissionDTO);
                submission.put(pId, submissionDTOList);
            }
            else{
                List<SubmissionDTO> submissionDTOList = new ArrayList<>();
                submissionDTOList.add(submissionDTO);
                submission.put(pId, submissionDTOList);
            }

            if(submissionDTO.isAccepted() && !problemSolved.contains(pId)){
                score += assignPoints(difficulty);
                problemSolved.add(pId);
                if(problemAttempted.contains(pId)){
                    problemAttempted.remove(String.valueOf(pId));
                }

                user.setProblems(problemSolved.size());
                user.setProblemFinalScore(score);
                userRepository.save(user);
            }
            else{
                if(!problemAttempted.contains(pId)){
                    problemAttempted.add(pId);
                }
            }
            userSubmissions.setProblemsSolved(problemSolved);
            userSubmissions.setSubmission(submission);
            userSubmissionsRepository.save(userSubmissions);
            return submissionDTO.isAccepted();
        }
    }

//    @Override
//    public MainSectionDTO sendMainSection(String email){
//        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
//        if(userSubmissions == null){
//            return new MainSectionDTO();
//        }
//        MainSectionDTO mainSectionDTO = new MainSectionDTO();
//        mainSectionDTO.setTotalScore(userSubmissions.getTotalScore());
//        mainSectionDTO.setProblemsSolved(userSubmissions.getProblemsSolved());
//        mainSectionDTO.setProblemsAttempted(userSubmissions.getProblemAttempted());
//        return mainSectionDTO;
//    }
}
