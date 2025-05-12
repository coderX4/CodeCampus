package com.coding_contest_platform.dto.mainsection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MainSectionDTO {
    private int problemsSolved;
    private int contestsParticipated;
    private int rank;
    private int streak;
    private List<ProgressDTO> topicProgress;
    private List<RecentSubmissionDTO> recentSubmissions;
    private List<UpCommingContest> upcomingContests;
}
