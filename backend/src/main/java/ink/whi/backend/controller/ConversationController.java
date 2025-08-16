package ink.whi.backend.controller;

import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.dao.converter.ConversationConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.conversation.ConversationDTO;
import ink.whi.backend.common.dto.conversation.ConvUpdateReq;
import ink.whi.backend.common.dto.conversation.ConversationVO;
import ink.whi.backend.common.dto.conversation.SimpleConvDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Conversation;
import ink.whi.backend.dao.entity.Message;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.service.conv.ConversationService;
import ink.whi.backend.service.conv.MessageService;
import ink.whi.backend.service.file.FileService;
import ink.whi.backend.service.model.ModelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 对话接口
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Slf4j
@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService convService;
    private final MessageService messageService;
    private final ModelService modelService;
    @Autowired
    private FileService fileService;

    /**
     * 创建新的对话
     *
     * @return 对话ID
     */
    @PostMapping("/{uuid}")
    public ResVo<ConversationDTO> createConv(@PathVariable String uuid) {
        if (StringUtils.isBlank(uuid)) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "uuid不能为空");
        }

        Conversation conversation = new Conversation();
        conversation.setTitle("新建对话");
        conversation.setUuid(uuid);
        conversation.setUserId(ReqInfoContext.getReqInfo().getUserId());

        conversation = convService.createConv(conversation);
        return ResVo.ok(ConversationConverter.toDTO(conversation));
    }

    /**
     * 获取对话详情
     *
     * @param uuid 对话ID
     * @return 对话详情
     */
    @GetMapping("/detail/{uuid}")
    public ResVo<ConversationVO> getConvDetail(@PathVariable String uuid) {
        ConversationVO vo = new ConversationVO();

        Conversation conv = convService.getAndCheck(uuid);
        vo.setConversation(ConversationConverter.toDTO(conv));

        List<MessageDTO> messages = messageService.queryMessageList(uuid);
        vo.setMessageList(messages);

        Message lastMessage = messageService.getLastMessage();
        if (lastMessage != null) {
            Integer modelId = lastMessage.getModelId();
            Model model = modelService.getById(modelId);
            vo.setCurrentModel(model);
        }

        return ResVo.ok(vo);
    }

    /**
     * 获取用户的所有对话
     *
     * @return 对话列表
     */
    @GetMapping("/list")
    public ResVo<List<SimpleConvDTO>> listConv() {
        Integer userId = ReqInfoContext.getUserId();
        List<Conversation> conversations = convService.listConvByUserId(userId);
        return ResVo.ok(ConversationConverter.toSimpleDTO(conversations));
    }

    /**
     * 更新对话信息
     *
     * @param req 更新请求
     * @return 是否成功
     */
    @PostMapping("/update")
    public ResVo<String> updateConvInfo(@RequestBody ConvUpdateReq req) {
        convService.updateConvInfo(req);
        return ResVo.ok("ok");
    }

    /**
     * 删除对话
     *
     * @param uuid 对话ID
     * @return 是否成功
     */
    @GetMapping("/del/{uuid}")
    public ResVo<String> deleteConv(@PathVariable String uuid) {
        convService.getAndCheck(uuid);

        // 删除对话相关的所有消息
        messageService.deleteAllMessages(uuid);

        // 删除对话
        convService.deleteConv(uuid);
        return ResVo.ok("ok");
    }

    /**
     * 上传附件
     * @param file
     * @param uuid
     * @return
     */
    @PostMapping("/upload")
    public ResVo<Integer> upload(@RequestParam("file") MultipartFile file, @RequestParam("uuid") String uuid) {
//            BaseFile baseFile = fileService.upload(file, uuid);
//            return ResVo.ok(baseFile.getId());
        return null;
    }
}
