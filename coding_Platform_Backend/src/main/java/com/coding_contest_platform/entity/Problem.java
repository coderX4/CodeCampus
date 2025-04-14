package com.coding_contest_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "problems")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Problem {
    @Id
    private String id;  // Custom ID
    private String title;
    private String difficulty;
    private List<String> tags;
    private String acceptance;
    private long acceptedSubmissions;
    private long submissions;
    private String dateAdded;
    private String status;
}
