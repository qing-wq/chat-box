package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.knowledgeBase.KbUpdateReq;
import ink.whi.backend.common.dto.knowledgeBase.KbDetailVO;
import ink.whi.backend.common.dto.knowledgeBase.SimpleKbDto;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.KnowledgeBase;
import ink.whi.backend.dao.mapper.KnowledgeBaseMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import ink.whi.backend.dao.converter.KnowledgeBaseConverter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 知识库服务实现
 *
 * @author: qing
 * @Date: 2025/7/27
 */
@Service
public class KnowledgeBaseService extends ServiceImpl<KnowledgeBaseMapper, KnowledgeBase> {

    @Lazy
    @Resource
    private KnowledgeBaseItemService knowledgeBaseItemService;

    public KnowledgeBase update(KbUpdateReq kbUpdateReq) {
        if (kbUpdateReq.getId() == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "id不能为空");
        }

        getAndCheck(kbUpdateReq.getId());
        KnowledgeBase kb = KnowledgeBaseConverter.toDO(kbUpdateReq);
        updateById(kb);
        return kb;
    }

    public List<SimpleKbDto> listKnowledgeBases() {
        Long userId = ReqInfoContext.getUserId().longValue();

        List<KnowledgeBase> knowledgeBases = lambdaQuery()
                .eq(KnowledgeBase::getOwnerId, userId)
                .orderByDesc(KnowledgeBase::getUpdateTime)
                .list();

        return knowledgeBases.stream().map(kb -> {
            SimpleKbDto dto = new SimpleKbDto();
            BeanUtils.copyProperties(kb, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    public KbDetailVO detail(String id) {
        KnowledgeBase knowledgeBase = getAndCheck(Integer.valueOf(id));

        KbDetailVO detailVO = new KbDetailVO();
        detailVO.setKnowledgeBase(knowledgeBase);

        // TODO: 这里需要根据实际的知识库项目表来查询
        // 暂时返回空列表
        detailVO.setItemLists(knowledgeBaseItemService.listItemByKbId(Integer.valueOf(id)));

        return detailVO;
    }

    /**
     * 获取知识库并检查权限
     */
    public KnowledgeBase getAndCheck(Integer id) {
        if (id == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "知识库ID不能为空");
        }

        KnowledgeBase knowledgeBase = lambdaQuery()
                .eq(KnowledgeBase::getId, id)
                .oneOpt()
                .orElse(null);
        checkStatus(knowledgeBase);
        return knowledgeBase;
    }

    /**
     * 检查知识库状态和权限
     */
    public void checkStatus(KnowledgeBase knowledgeBase) {
        if (knowledgeBase == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "知识库不存在");
        }

        Integer currentUserId = ReqInfoContext.getUserId();
        if (!Objects.equals(knowledgeBase.getOwnerId(), currentUserId)) {
            throw BusinessException.newInstance(StatusEnum.FORBID_ERROR, "无权限访问该知识库");
        }
    }

    /**
     * 删除知识库
     */
    public void deleteKnowledgeBase(Integer id) {
        KnowledgeBase knowledgeBase = getAndCheck(id);
        removeById(knowledgeBase.getId());
    }

    public KnowledgeBase getByTitle(String title) {
        return lambdaQuery()
                .eq(KnowledgeBase::getOwnerId, ReqInfoContext.getUserId())
                .eq(KnowledgeBase::getTitle, title).one();
    }
}