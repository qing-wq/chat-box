package ink.whi.backend.rag;


import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.model.openai.OpenAiTokenizer;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.filter.Filter;
import dev.langchain4j.store.embedding.filter.comparison.IsEqualTo;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.regex.Matcher;


@Slf4j
public class EmbeddingRAG implements IRAGService{

    /**
     * 向量搜索时命中所需的最低分数
     */
    public static final double RAG_MIN_SCORE = 0.6;

    /**
     * 每块文档长度（按token算）
     */
    public static final int RAG_MAX_SEGMENT_SIZE_IN_TOKENS = 512;

    private EmbeddingModel embeddingModel;

    private final EmbeddingStore<TextSegment> embeddingStore;

    public EmbeddingRAG(EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingStore = embeddingStore;
    }

    public void init() {
        log.info("initEmbeddingModel");
        embeddingModel = new AllMiniLmL6V2EmbeddingModel();
    }

    /**
     * 对文档切块、向量化并存储到数据库
     *
     * @param document 知识库文档
     * @param overlap  重叠token数
     */
    public void ingest(Document document, int overlap) {
        // TODO 配置切分大小
        log.info("EmbeddingRAG ingest");
        DocumentSplitter documentSplitter = DocumentSplitters.recursive(RAG_MAX_SEGMENT_SIZE_IN_TOKENS, overlap, new OpenAiTokenizer(OpenAiChatModelName.GPT_3_5_TURBO));
        EmbeddingStoreIngestor embeddingStoreIngestor = EmbeddingStoreIngestor.builder()
                .documentSplitter(documentSplitter)
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();
        embeddingStoreIngestor.ingest(document);
    }


    /**
     * @param metadataCond
     * @param maxResults
     * @param minScore
     * @param breakIfSearchMissed 如果向量数据库中搜索不到数据，是否强行中断该搜索，不继续往下执行（即不继续请求LLM进行回答）
     * @return
     */
    @Override
    public EmbeddingStoreContentRetriever createRetriever(Map<String, String> metadataCond, int maxResults, double minScore) {
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
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(maxResults <= 0 ? 3 : maxResults)
                .minScore(minScore <= 0 ? RAG_MIN_SCORE : minScore)
                .filter(filter)
                .build();
    }
}
