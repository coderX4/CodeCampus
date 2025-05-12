package com.coding_contest_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "problems_tag_list")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemTagsList {
    @Id
    private String id = "1";
    private Map<String, Integer> problemTagsList;
}
