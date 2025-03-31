package com.coding_contest_platform.controller;

import com.coding_contest_platform.services.EditorService;
import com.coding_contest_platform.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/editor")
@RequiredArgsConstructor
public class EditorController {

    private final EditorService editorService;

    @GetMapping({"/getproblem/{id}"})
    public ResponseEntity<?> getProblem(@PathVariable String id) {
        return ResponseEntity.ok(editorService.getProblem(id));
    }
}
