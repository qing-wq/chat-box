package ink.whi.backend.service.rag;


import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.filter.Filter;
import dev.langchain4j.store.embedding.filter.comparison.IsEqualTo;
import ink.whi.backend.common.dto.agent.RetrieveSetting;
import ink.whi.backend.common.dto.knowledgeBase.ProcessSetting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

import static ink.whi.backend.common.constant.SettingsDefaultConstant.*;


@Slf4j
@Service
public class EmbeddingRagService implements IRAGService {

    private final EmbeddingModel embeddingModel;

    private final EmbeddingStore<TextSegment> embeddingStore;

    public EmbeddingRagService(EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingStore = embeddingStore;
        this.embeddingModel = new AllMiniLmL6V2EmbeddingModel();
    }

    /**
     * 对文档切块、向量化并存储到数据库
     *
     * @param document 知识库文档
     * @param processSetting 处理设置
     */
    public void ingest(Document document, ProcessSetting processSetting) {
        log.info("EmbeddingRAG ingest");
        DocumentSplitter documentSplitter = DocumentSplitters.recursive(processSetting.getBlockSize(), processSetting.getMaxOverlap(), new OpenAiTokenizer(OpenAiChatModelName.GPT_3_5_TURBO));
        EmbeddingStoreIngestor embeddingStoreIngestor = EmbeddingStoreIngestor.builder()
                .documentSplitter(documentSplitter)
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();
        embeddingStoreIngestor.ingest(document);
    }


    /**
     * 创建检索器
     * @param metadataCond
     * @param retrieveSetting 检索参数
     * @return
     */
    @Override
    public EmbeddingStoreContentRetriever createRetriever(Map<String, String> metadataCond, RetrieveSetting retrieveSetting) {
        Filter filter = null;
        for (Map.Entry<String, String> entry : metadataCond.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (null == filter) {
                filter = new IsEqualTo(key, value);
            } else {
                filter = filter.and(new IsEqualTo(key, value));
            }
        }
        int maxResults = retrieveSetting.getRetrieveMaxResults();
        double minScore = retrieveSetting.getRetrieveMinScore();
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(maxResults <= 0 ? 3 : maxResults)
                .minScore(minScore <= 0 ? RAG_MIN_SCORE : minScore)
                .filter(filter)
                .build();
    }
}
