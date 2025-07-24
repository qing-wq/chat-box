package ink.whi.backend.service;

import com.google.common.collect.Maps;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.converter.ModelConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.dto.model.SimpleModelDTO;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.Platform;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author: qing
 * @Date: 2025/7/20
 */
@Service
@RequiredArgsConstructor
public class PMService {
    private final PlatformService platformService;
    private final ModelService modelService;









}
