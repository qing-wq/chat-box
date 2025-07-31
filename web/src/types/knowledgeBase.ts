// Knowledge Base types
export interface KnowledgeBase {
  id?: number;
  createTime?: string;
  updateTime?: string;
  title: string;
  remark?: string;
  isPublic?: boolean;
  ownerId?: number;
  embeddingModelId?: number;
  qaModelId?: number;
  processType?: string;
  blockSize?: number;
  maxOverlap?: string;
  qaPrompt?: string;
  retrieveMaxResults?: number;
  retrieveMinScore?: number;
}

export interface KbItemDto {
  id?: number;
  createTime?: string;
  updateTime?: string;
  title?: string;
  processType?: string;
  chunks?: number;
  embeddingStatus?: string;
  isEnable?: boolean;
}

export interface KbDetailVO {
  knowledgeBase: KnowledgeBase;
  itemLists?: KbItemDto[];
}

export interface SimpleKbDto {
  id?: number;
  createTime?: string;
  updateTime?: string;
  title?: string;
  remark?: string;
  isPublic?: boolean;
}