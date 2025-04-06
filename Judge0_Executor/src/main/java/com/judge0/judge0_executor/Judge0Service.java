package com.judge0.judge0_executor;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import okhttp3.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
public class Judge0Service {

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    private static final String JUDGE0_URL = "https://judge0-extra-ce.p.rapidapi.com/submissions";

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Response submitCode(String code, String stdin, int languageId)  throws IOException {
        String encodedCode = Base64.getEncoder().encodeToString(code.getBytes());

        String jsonPayload = "{" +
                "\"language_id\":" + languageId + "," +
                "\"source_code\":\"" + encodedCode + "\"," +
                "\"stdin\":\"" + stdin + "\"}";

        RequestBody body = RequestBody.create(jsonPayload, MediaType.get("application/json"));

        Request request = new Request.Builder()
                .url(JUDGE0_URL + "?base64_encoded=true&wait=false&fields=*")
                .post(body)
                .addHeader("x-rapidapi-key", rapidApiKey)
                .addHeader("x-rapidapi-host", "judge0-extra-ce.p.rapidapi.com")
                .addHeader("Content-Type", "application/json")
                .build();

        return client.newCall(request).execute(); // This contains the token
    }

    public Response getResult(String token) throws IOException {
        Request request = new Request.Builder()
                .url(JUDGE0_URL + "/" + token + "?base64_encoded=true&fields=*")
                .get()
                .addHeader("x-rapidapi-key", rapidApiKey)
                .addHeader("x-rapidapi-host", "judge0-extra-ce.p.rapidapi.com")
                .addHeader("Content-Type", "application/json")
                .build();

        return client.newCall(request).execute();

    }

}
