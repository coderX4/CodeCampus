package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.leaderboard.GlobalLeaderBoardDTO;
import com.coding_contest_platform.dto.login_signup.AdminRegisterRequest;
import com.coding_contest_platform.dto.mainsection.MainSectionDTO;
import com.coding_contest_platform.dto.mainsection.ProgressDTO;
import com.coding_contest_platform.dto.mainsection.RecentSubmissionDTO;
import com.coding_contest_platform.dto.mainsection.UpCommingContest;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.entity.UserSubmissions;
import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import com.coding_contest_platform.helper.Role;
import com.coding_contest_platform.repository.*;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServices {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserSubmissionsRepository userSubmissionsRepository;
    private final ProblemTagsListRepository problemTagsListRepository;
    private final ContestRepository contestRepository;


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public String getIdByEmail(String email) {
        User user = getUserByEmail(email);
        return user.getId();
    }

    public Role assignRole(String role){
        return switch (role){
            case "ADMIN" -> Role.ADMIN;
            case "MODERATOR" -> Role.MODERATOR;
            default -> Role.USER;
        };
    }

    @Override
    public Department assignDepartment(String department){
        return switch (department) {
            case "ADMIN" -> Department.ADMIN;
            case "DS" -> Department.DS;
            case "AIML" -> Department.AIML;
            case "AI" -> Department.AI;
            case "ML" -> Department.ML;
            case "CSBS" -> Department.CSBS;
            case "ME" -> Department.ME;
            case "BIOTECH" -> Department.BIOTECH;
            case "ECE" -> Department.ECE;
            case "IOT" -> Department.IOT;
            default -> Department.CSE;
        };
    }

    @Transactional
    @Override
    public User createUser(AdminRegisterRequest request, Provider provider) {
        String uname = request.getFirstName() + " " + request.getLastName();

        LocalDate date = LocalDate.now(); // Get current date
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Define format
        String formattedDate = date.format(dateFormatter);

        User user = new User(uname, request.getEmail(),
                passwordEncoder.encode(request.getPassword()), assignRole(request.getRole()),
                assignDepartment(request.getDepartment()), provider,"active",
                formattedDate,formattedDate,0,0,0,0,new long[]{0,0},0
        );
        userRepository.save(user);
        makeProgressDTOMap(user);
        return user;
    }

    @Transactional
    @Override
    public User updateUser(String email, AdminRegisterRequest request) {
        User user = userRepository.findByEmail(email);
        String uname = request.getFirstName() + " " + request.getLastName();
        user.setUname(uname);

        if(!request.getRole().equals("")){
            user.setRole(assignRole(request.getRole()));
        }
        if(!request.getDepartment().equals("")){
            user.setDepartment(assignDepartment(request.getDepartment()));
        }

        String password = request.getPassword();
        if(password != null){
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        return user;
    }

    @Transactional
    @Override
    public void makeProgressDTOMap(User user){
        Map<String, Integer> problemTagList = problemTagsListRepository.findOneById("1").getProblemTagsList();
        Map<String, ProgressDTO> progressDTOMap = new HashMap<>();
        for (Map.Entry<String, Integer> entry : problemTagList.entrySet()) {
            ProgressDTO progressDTO = new ProgressDTO();
            progressDTO.setTopic(entry.getKey());
            progressDTO.setTotal(entry.getValue());
            progressDTO.setCompleted(0);
            progressDTOMap.put(entry.getKey(), progressDTO);
        }
        user.setProgressDTOMap(progressDTOMap);
        userRepository.save(user);
    }

    private List<UpCommingContest> getUpCommingContests(){
        List<UpCommingContest> upCommingContests = new ArrayList<>();
        for(Contest contest : contestRepository.findAll()){
            UpCommingContest upCommingContest = new UpCommingContest(
                    contest.getId(), contest.getTitle(), contest.getDescription(),
                    contest.getStartDate(), contest.getStartTime(), contest.getDuration(),
                    contest.getDifficulty(),contest.getParticipants()
            );
            upCommingContests.add(upCommingContest);
        }
        return upCommingContests;
    }

    private List<ProgressDTO> getProgressDTOList(Map<String, ProgressDTO> progressDTOMap){
        return new ArrayList<>(progressDTOMap.values());
    }

    private int getRankOfUser(String email) {
        List<GlobalLeaderBoardDTO> globalLeaderBoardDTOList = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            GlobalLeaderBoardDTO globalLeaderBoardDTO = new GlobalLeaderBoardDTO(
                    user.getUname(), user.getEmail(), user.getDepartment(),
                    user.getProblems(), user.getContests(),
                    user.getProblemFinalScore(), user.getContestFinalScore(),
                    user.getFinalLeaderBoardScore()
            );
            globalLeaderBoardDTOList.add(globalLeaderBoardDTO);
        }
        globalLeaderBoardDTOList.sort((a, b) -> {
            // 1. Sort by finalScore descending
            int leaderBoardScoreCompare = Integer.compare(b.getFinalLeaderBoardScore(), a.getFinalLeaderBoardScore());
            if (leaderBoardScoreCompare != 0) return leaderBoardScoreCompare;

            //2. Sort by contest finalScores descending
            int contestScoreCompare = Integer.compare(b.getContestFinalScore(), a.getContestFinalScore());
            if (contestScoreCompare != 0) return contestScoreCompare;

            //3. Sort by problem finalScores descending
            return Integer.compare(b.getProblemFinalScore(), a.getProblemFinalScore());
        });
        int rank = 0;
        for(GlobalLeaderBoardDTO globalLeaderBoardDTO : globalLeaderBoardDTOList){
            if(globalLeaderBoardDTO.getEmail().equals(email)){
                rank = globalLeaderBoardDTOList.indexOf(globalLeaderBoardDTO) + 1;
                return rank;
            }
        }
        return rank;
    }


    @Override
    public MainSectionDTO sendMainSection(String email){
        User user = userRepository.findByEmail(email);
        Map<String, ProgressDTO> map = user.getProgressDTOMap();
        List<ProgressDTO> progressDTOList = getProgressDTOList(map);
        LinkedList<RecentSubmissionDTO> recentSubmissionDTOList;
        UserSubmissions userSubmissions = userSubmissionsRepository.findByEmail(email);
        if(userSubmissions == null){
            recentSubmissionDTOList = new LinkedList<>();
        }
        else{
            recentSubmissionDTOList = userSubmissions.getRecentSubmissionsDTOList();
        }
        List<UpCommingContest> contestList = getUpCommingContests();
        int rank = getRankOfUser(email);
        return new MainSectionDTO(
                user.getProblems(), user.getContests(), rank, 0, progressDTOList,
                recentSubmissionDTOList, contestList
        );
    }
}
