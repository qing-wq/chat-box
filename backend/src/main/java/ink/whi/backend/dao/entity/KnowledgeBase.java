package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/6/18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("knowledge_base")
public class KnowledgeBase extends BaseEntity {

    private String title;

    /**
     * 描述
     */
    private String remark;

    private Boolean isPublic;

    /**
     * 严格模式
     */
    private Boolean isStrict;

    /**
     * 知识点数量
     */
    private Integer itemCount;

    /**
     * 向量数
     */
    private Integer embeddingCount;

    private Long ownerId;

    private String ownerName;

    /**
     * 文档切割时重叠数量(按token来计)
     */
    private Integer ingestMaxOverlap;

    /**
     * 索引(图谱化)文档时使用的LLM,如不指定的话则使用第1个可用的LLM
     */
    private String ingestModelName;

    /**
     * 索引(图谱化)文档时使用的LLM,如不指定的话则使用第1个可用的LLM
     */
    private Long ingestModelId;

    /**
     * "文档召回最大数量"
     */
    private Integer retrieveMaxResults;

    /**
     * 文档召回最小分数
     */
    private Double retrieveMinScore;

    /**
     * 请求LLM时的temperature
     */
    private Double queryLlmTemperature;

    /**
     * 请求LLM时的系统提示词
     */
    private String querySystemMessage;
}
