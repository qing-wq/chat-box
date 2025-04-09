import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, List, Tooltip, Dropdown, Menu } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchChatList, createNewChat, deleteChat, updateChatInfo } from '../../store/chatSlice';
import { logout } from '../../store/userSlice';
import { setTheme } from '../../store/configSlice';
import { ThemeMode } from '../../types';
import { Modal, Input } from 'antd';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { chatList, loading } = useAppSelector(state => state.chat);
  const { theme } = useAppSelector(state => state.config);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editChatId, setEditChatId] = React.useState<number | null>(null);
  const [editChatTitle, setEditChatTitle] = React.useState('');

  // Fetch chat list on component mount
  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  // Handle creating a new chat
  const handleNewChat = async () => {
    const resultAction = await dispatch(createNewChat());
    if (createNewChat.fulfilled.match(resultAction)) {
      navigate(`/chat/${resultAction.payload.id}`);
    }
  };

  // Handle selecting a chat
  const handleSelectChat = (id: number) => {
    navigate(`/chat/${id}`);
  };

  // Handle deleting a chat
  const handleDeleteChat = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(deleteChat(id));
    
    // If the deleted chat is the current one, navigate to the first available chat or home
    if (Number(chatId) === id) {
      if (chatList.length > 1) {
        const nextChat = chatList.find(chat => chat.id !== id);
        if (nextChat) {
          navigate(`/chat/${nextChat.id}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  };

  // Handle editing a chat title
  const handleEditClick = (id: number, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditChatId(id);
    setEditChatTitle(title);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (editChatId && editChatTitle.trim()) {
      await dispatch(updateChatInfo({
        id: editChatId,
        title: editChatTitle.trim()
      }));
      setEditModalVisible(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleNewChat}
          className="w-full bg-primary hover:bg-primary-dark"
          loading={loading}
        >
          New Chat
        </Button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <List
          loading={loading}
          dataSource={chatList}
          renderItem={chat => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 ${
                Number(chatId) === chat.id ? 'bg-primary-light dark:bg-primary-light' : ''
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-light-text dark:text-dark-text truncate max-w-[160px]">
                    {chat.title || 'New Chat'}
                  </div>
                  <div className="flex space-x-1">
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => handleEditClick(chat.id, chat.title, e)}
                        className="text-gray-500 hover:text-primary"
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-gray-500 hover:text-red-500"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(chat.createTime)}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <div className="flex justify-between">
          <Tooltip title="Settings">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate('/settings')}
              className="text-light-text dark:text-dark-text"
            />
          </Tooltip>
          <Tooltip title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <Button
              type="text"
              icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
              onClick={handleThemeToggle}
              className="text-light-text dark:text-dark-text"
            />
          </Tooltip>
          <Tooltip title="Logout">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="text-light-text dark:text-dark-text"
            />
          </Tooltip>
        </div>
      </div>

      {/* Edit Chat Title Modal */}
      <Modal
        title="Edit Chat Title"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okButtonProps={{ className: 'bg-primary hover:bg-primary-dark' }}
      >
        <Input
          value={editChatTitle}
          onChange={(e) => setEditChatTitle(e.target.value)}
          placeholder="Enter chat title"
          autoFocus
        />
      </Modal>
    </div>
  );
};

export default Sidebar;
