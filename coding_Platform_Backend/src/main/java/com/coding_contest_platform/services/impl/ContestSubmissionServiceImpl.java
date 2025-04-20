package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import com.coding_contest_platform.entity.ContestSubmissions;
import com.coding_contest_platform.repository.ContestSubmissionsRepository;
import com.coding_contest_platform.services.ContestSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContestSubmissionServiceImpl implements ContestSubmissionService {
    private final ContestSubmissionsRepository contestSubmissionsRepository;

    @Transactional
    @Override
    public boolean saveContestSubmission(String contestId, String uId, String pId, List<ExecutionResponse> executionResponseList, String language, String code) {
        ContestSubmissions contestSubmissions = contestSubmissionsRepository.findOneByContestId(contestId);
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

        if(contestSubmissions == null){
            contestSubmissions = new ContestSubmissions();
            contestSubmissions.setContestId(contestId);
            List<SubmissionDTO> submissionDTOList = new ArrayList<>();
            submissionDTOList.add(submissionDTO);

            // put the list of submissiondto in pid
            Map<String, List<SubmissionDTO>> userSubmissions = new HashMap<>();
            userSubmissions.put(pId, submissionDTOList);

            //put the map of pid submissions in email
            Map<String, Map<String, List<SubmissionDTO>>> contestSubmission = new HashMap<>();
            contestSubmission.put(uId, userSubmissions);
            contestSubmissions.setContestSubmissions(contestSubmission);
            contestSubmissionsRepository.save(contestSubmissions);
            return submissionDTO.isAccepted();
        }
        else{
            Map<String, Map<String, List<SubmissionDTO>>> contestSubmission = contestSubmissions.getContestSubmissions();
            Map<String, List<SubmissionDTO>> submission = contestSubmission.getOrDefault(uId, new HashMap<>());

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
            contestSubmission.put(uId,submission);
            contestSubmissions.setContestSubmissions(contestSubmission);
            contestSubmissionsRepository.save(contestSubmissions);
            return submissionDTO.isAccepted();
        }
    }

    @Override
    public Map<String, List<SubmissionDTO>> getSubmissions(String id, String uId){
        ContestSubmissions contestSubmissions = contestSubmissionsRepository.findOneByContestId(id);
        Map<String, Map<String, List<SubmissionDTO>>> contestSubmission = contestSubmissions.getContestSubmissions();

        return contestSubmission.getOrDefault(uId, new HashMap<>());
    }
}
