package com.coding_contest_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "problem_sequences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemSequence {
    @Id
    private String prefix;  // Example: "EABG"
    private int sequence;   // Last used number
}