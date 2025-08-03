package ink.whi.backend.common.dto.message;

import dev.langchain4j.model.output.TokenUsage;
import lombok.Builder;
import lombok.Data;
import org.apache.el.parser.Token;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class ITokenUsage {

    private Integer inputTokenCount;

    private Integer outputTokenCount;

    private Integer totalTokenCount;

    public ITokenUsage(TokenUsage tokenUsage) {
        this.inputTokenCount = tokenUsage.inputTokenCount();
        this.outputTokenCount = tokenUsage.outputTokenCount();
        this.totalTokenCount = tokenUsage.totalTokenCount();
    }
}
