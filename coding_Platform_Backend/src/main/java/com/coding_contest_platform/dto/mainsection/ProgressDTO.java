package com.coding_contest_platform.dto.mainsection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressDTO {
    private String topic;
    private int completed;
    private int total;
}
