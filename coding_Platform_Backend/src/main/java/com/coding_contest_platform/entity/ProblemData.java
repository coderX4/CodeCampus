package com.coding_contest_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "problemsdata")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemData {
    @Id
    private String id;  // Custom ID same as that of Problem
    private String description;
    private String approach;
}
