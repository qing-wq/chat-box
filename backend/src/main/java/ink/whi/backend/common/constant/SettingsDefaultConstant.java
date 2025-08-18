package ink.whi.backend.common.constant;

/**
 * 设置默认配置
 * @author: qing
 * @Date: 2025/8/5
 */
public class SettingsDefaultConstant {
    /**
     * 向量搜索时命中所需的最低分数
     */
    public static final double RAG_MIN_SCORE = 0.6;

    /**
     * 每块文档长度（按token算）
     */
    public static final int RAG_MAX_SEGMENT_SIZE_IN_TOKENS = 512;
}
