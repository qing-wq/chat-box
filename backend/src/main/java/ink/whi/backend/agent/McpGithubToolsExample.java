package ink.whi.backend.agent;

import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.McpTransport;
import dev.langchain4j.mcp.client.transport.stdio.StdioMcpTransport;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Example demonstrating the use of Model Context Protocol (MCP) with GitHub tools
 * This allows LangChain4j to connect to an MCP-compliant GitHub server to access repository information
 */
@Component
public class McpGithubToolsExample {

//    @Value("${openai.api.key}")
    private String openaiApiKey;

    /**
     * Interface defining the operations that can be performed using MCP GitHub tools
     */
    public interface GitHubAssistant {
        String chat(String userMessage);
    }

    /**
     * Creates a GitHubAssistant using MCP with GitHub tools
     * 
     * @return A GitHubAssistant that can interact with GitHub through MCP
     */
    public GitHubAssistant createGitHubAssistant() {
        // Create the chat language model using OpenAI
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName("gpt-4o-mini") // You may need to update this to a model you have access to
                .logRequests(true)
                .logResponses(true)
                .build();

        // Create the MCP transport using stdio to communicate with the GitHub MCP server
        // Note: This requires Docker to be installed and available at the specified path
        McpTransport transport = new StdioMcpTransport.Builder()
                .command(List.of("/usr/local/bin/docker", "run", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "-i", "mcp/github"))
                .logEvents(true)
                .build();

        // Create the MCP client from the transport
        McpClient mcpClient = new DefaultMcpClient.Builder()
                .transport(transport)
                .build();

        // Create the MCP tool provider from the client
        ToolProvider toolProvider = McpToolProvider.builder()
                .mcpClients(List.of(mcpClient))
                .build();

        // Create and return the GitHubAssistant service
        return AiServices.builder(GitHubAssistant.class)
                .chatLanguageModel(model)
                .toolProvider(toolProvider)
                .build();
    }

    /**
     * Gets a summary of recent commits in a GitHub repository
     * 
     * @param repoName The repository name (e.g., "langchain4j/langchain4j")
     * @param commitsCount The number of commits to summarize
     * @return A summary of the recent commits
     */
    public String getRecentCommitsSummary(String repoName, int commitsCount) {
        try {
            GitHubAssistant githubAssistant = createGitHubAssistant();
            String prompt = String.format("Summarize the last %d commits of the %s GitHub repository", 
                                        commitsCount, repoName);
            return githubAssistant.chat(prompt);
        } catch (Exception e) {
            return "Error accessing GitHub through MCP: " + e.getMessage();
        }
    }

    /**
     * Gets information about a GitHub repository
     * 
     * @param repoName The repository name (e.g., "langchain4j/langchain4j")
     * @return Information about the repository
     */
    public String getRepositoryInfo(String repoName) {
        try {
            GitHubAssistant githubAssistant = createGitHubAssistant();
            String prompt = String.format("Provide information about the %s GitHub repository including description, stars, forks, and main topics", 
                                        repoName);
            return githubAssistant.chat(prompt);
        } catch (Exception e) {
            return "Error accessing GitHub through MCP: " + e.getMessage();
        }
    }

    /**
     * Gets information about open issues in a GitHub repository
     * 
     * @param repoName The repository name (e.g., "langchain4j/langchain4j")
     * @param issuesCount The number of issues to retrieve
     * @return Information about open issues
     */
    public String getOpenIssues(String repoName, int issuesCount) {
        try {
            GitHubAssistant githubAssistant = createGitHubAssistant();
            String prompt = String.format("List the top %d open issues in the %s GitHub repository with their titles and labels", 
                                        issuesCount, repoName);
            return githubAssistant.chat(prompt);
        } catch (Exception e) {
            return "Error accessing GitHub through MCP: " + e.getMessage();
        }
    }
}
