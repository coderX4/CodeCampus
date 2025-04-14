package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.SubmissionDTO;
import com.coding_contest_platform.entity.UserSubmissions;
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

    @Override
    public List<SubmissionDTO> getSubmissions(String email, String id){
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        if(userSubmissions == null){
            return new ArrayList<>();
        }
        return userSubmissions.getSubmission().get(id);
    }

    @Override
    public boolean saveSubmissions(String email, String pId, List<ExecutionResponse> executionResponseList, String language, String code){
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        //SubmissionDTO submissionDTO = saveDto(language, code, executionResponseList);
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
            userSubmissionsRepository.save(userSubmissions);
            return submissionDTO.isAccepted();
        }
        else{
            Map<String, List<SubmissionDTO>> submission = userSubmissions.getSubmission();

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

            userSubmissions.setSubmission(submission);
            userSubmissionsRepository.save(userSubmissions);
            return submissionDTO.isAccepted();
        }
    }
}
