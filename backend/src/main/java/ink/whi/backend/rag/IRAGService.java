package ink.whi.backend.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import ink.whi.backend.common.dto.agent.RetrieveSetting;
import ink.whi.backend.common.dto.knowledgeBase.ProcessSetting;

import java.util.Map;

/**
 * @author: qing
 * @Date: 2025/8/2
 */
public interface IRAGService {
    void ingest(Document document, ProcessSetting setting);

    ContentRetriever createRetriever(Map<String, String> metadataCond, RetrieveSetting retrieveSetting);
}
