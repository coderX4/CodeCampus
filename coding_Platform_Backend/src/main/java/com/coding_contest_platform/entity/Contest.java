package com.coding_contest_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "contests")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contest {
    @Id
    private String id;
    private String title;
    private String description;
    private String startDate;
    private String startTime;
    private String duration;
    private String difficulty;
    private String rules;
    private boolean saveAsDraft;
    private List<String> problems; // it stores the problem ids.
    private int participants;
    private List<String> emailsParticipants;
}
