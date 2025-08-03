package ink.whi.backend.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Getter
public enum ProcessTypeEnum {
    // 直接分段
    DIRECT(0, "直接分段"),
    // 问答拆分
    QA(1, "问答拆分");
    
    @EnumValue
    private final int type;
    private final String desc;
    
    ProcessTypeEnum(int type, String desc) {
        this.type = type;
        this.desc = desc;
    }

    public static ProcessTypeEnum ofName(String desc) {
        if (StringUtils.isBlank(desc)) {
            return null;
        }

        for (ProcessTypeEnum processTypeEnum : ProcessTypeEnum.values()) {
            if (processTypeEnum.getDesc().equals(desc)) {
                return processTypeEnum;
            }
        }
        return null;
    }
}
