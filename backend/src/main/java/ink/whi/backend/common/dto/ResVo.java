package ink.whi.backend.common.dto;

import ink.whi.backend.common.status.Status;
import ink.whi.backend.common.status.StatusEnum;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 响应封装类
 *
 * @author: qing
 * @Date: 2025/3/5
 */
@Data
public class ResVo<T> implements Serializable {
    @Serial
    private static final long serialVersionUID = -510306209659393854L;

    private Status status;

    private T data;

    public ResVo() {
    }

    public ResVo(Status status) {
        this.status = status;
    }

    public ResVo(T data) {
        this.status = Status.newStatus(StatusEnum.SUCCESS);
        this.data = data;
    }

    public static ResVo<String> ok() {
        return ok("ok");
    }

    public static <T> ResVo<T> ok(T result) {
        return new ResVo<T>(result);
    }


    public static <T> ResVo<T> fail(StatusEnum statusEnum, Object... args) {
        return new ResVo<>(Status.newStatus(statusEnum, args));
    }

    public static <T> ResVo<T> fail(Status status) {
        return new ResVo<>(status);
    }
}
