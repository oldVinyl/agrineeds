package quantumloop.agrineeds.models;

// tiny DTO to match api.js payload
public class StatusDto {
    private String status;
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}