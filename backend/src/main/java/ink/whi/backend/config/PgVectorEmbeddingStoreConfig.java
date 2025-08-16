package ink.whi.backend.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import ink.whi.backend.rag.EmbeddingRagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * pgvector的相关配置
 */
@Slf4j
@Configuration
//@ConditionalOnProperty(value = "vector-database", havingValue = "pgvector")
public class PgVectorEmbeddingStoreConfig {

    @Value("${vector.datasource.url}")
    private String dataBaseUrl;

    @Value("${vector.datasource.username}")
    private String dataBaseUserName;

    @Value("${vector.datasource.password}")
    private String dataBasePassword;

    @Primary
    @Bean(name = "kbEmbeddingStore")
    public EmbeddingStore<TextSegment> initKbEmbeddingStore() {
        // 正则表达式匹配
        String regex = "jdbc:postgresql://([^:/]+):(\\d+)/([\\w-]+).+";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(dataBaseUrl);

        String host = "";
        String port = "";
        String databaseName = "";
        if (matcher.matches()) {
            host = matcher.group(1);
            port = matcher.group(2);
            databaseName = matcher.group(3);

            log.info("Host: " + host);
            log.info("Port: " + port);
            log.info("Database: " + databaseName);
        } else {
            throw new RuntimeException("parse url error");
        }
        return PgVectorEmbeddingStore.builder()
                .host(host)
                .port(Integer.parseInt(port))
                .database(databaseName)
                .user(dataBaseUserName)
                .password(dataBasePassword)
                .dimension(384)
                .createTable(true)
                .dropTableFirst(false)
                .table("adi_knowledge_base_embedding")
                .build();
    }

//    @Bean
//    @Primary
//    public EmbeddingRagService initKnowledgeBaseRAGService(EmbeddingStore<TextSegment> kbEmbeddingStore) {
//        EmbeddingRagService ragService = new EmbeddingRagService(kbEmbeddingStore);
//        ragService.init();
//        return ragService;
//    }
}
