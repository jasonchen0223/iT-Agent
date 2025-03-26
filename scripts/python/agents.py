"""
基本的AutoGen代理定义

这个模块包含项目中使用的基本代理定义。
"""
import autogen
import json
import sys
import os
from typing import Dict, List, Any, Optional

# 检查AutoGen是否正确安装
def check_autogen_installation():
    """
    检查AutoGen是否正确安装
    
    Returns:
        dict: 安装状态信息
    """
    try:
        version = autogen.__version__
        result = {
            "installed": True,
            "version": version,
            "status": "正常"
        }
        print(json.dumps(result))
        return result
    except Exception as e:
        result = {
            "installed": False,
            "error": str(e),
            "status": "错误"
        }
        print(json.dumps(result))
        return result

# 基本LLM配置
DEFAULT_LLM_CONFIG = {
    "temperature": 0.2,
    "request_timeout": 600,
    "seed": 42,
    "model": "gpt-4",
}

def create_agent_from_config(agent_config: Dict[str, Any]) -> autogen.ConversableAgent:
    """
    根据配置创建AutoGen代理
    
    Args:
        agent_config: 代理配置
        
    Returns:
        autogen.ConversableAgent: 创建的代理实例
    """
    agent_id = agent_config["id"]
    agent_role = agent_config["role"]
    agent_name = agent_config["name"]
    system_message = agent_config["systemMessage"]
    
    # 获取LLM配置，如果没有则使用默认配置
    llm_config = agent_config.get("llmConfig", DEFAULT_LLM_CONFIG)
    
    # 根据角色创建不同类型的代理
    if agent_role == "user":
        # 用户代理
        return autogen.UserProxyAgent(
            name=agent_name,
            human_input_mode="TERMINATE",
            system_message=system_message,
        )
    else:
        # 其他AI代理
        return autogen.AssistantAgent(
            name=agent_name,
            llm_config=llm_config,
            system_message=system_message,
        )

def create_agents_from_session(session_config: Dict[str, Any]) -> List[autogen.ConversableAgent]:
    """
    从会话配置创建代理列表
    
    Args:
        session_config: 会话配置
        
    Returns:
        List[autogen.ConversableAgent]: 代理列表
    """
    agents = []
    for agent_config in session_config["agents"]:
        agent = create_agent_from_config(agent_config)
        agents.append(agent)
    return agents

def run_conversation(query: str, session_config_json: str) -> Dict[str, Any]:
    """
    运行代理对话
    
    Args:
        query: 用户查询
        session_config_json: 会话配置JSON字符串
        
    Returns:
        Dict[str, Any]: 对话结果
    """
    try:
        # 解析会话配置
        session_config = json.loads(session_config_json)
        
        # 创建代理
        agents = create_agents_from_session(session_config)
        
        # 获取用户代理（通常是第一个代理）
        user_proxy = next((agent for agent in agents if isinstance(agent, autogen.UserProxyAgent)), agents[0])
        
        # 创建对话组
        groupchat = autogen.GroupChat(
            agents=agents,
            messages=[],
            max_round=session_config.get("maxRounds", 10)
        )
        manager = autogen.GroupChatManager(groupchat=groupchat)
        
        # 启动对话
        user_proxy.initiate_chat(
            manager,
            message=query,
        )
        
        # 提取对话历史并格式化
        formatted_messages = []
        for msg in groupchat.messages:
            formatted_messages.append({
                "role": msg["role"],
                "content": msg["content"],
                "sender": msg.get("name", msg["role"]),
                "timestamp": None  # AutoGen消息没有时间戳
            })
        
        # 返回结果
        result = {
            "success": True,
            "messages": formatted_messages,
            "sessionId": session_config["id"]
        }
        
        print(json.dumps(result))
        return result
    
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "messages": []
        }
        print(json.dumps(error_result))
        return error_result

# 命令行入口
if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) < 2:
        print(json.dumps({"error": "缺少命令参数"}))
        sys.exit(1)
        
    command = sys.argv[1]
    
    # 分发命令
    if command == "check_installation":
        check_autogen_installation()
    
    elif command == "run_conversation":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "缺少查询和会话配置参数"}))
            sys.exit(1)
            
        query = sys.argv[2]
        session_config_json = sys.argv[3]
        run_conversation(query, session_config_json)
    
    else:
        print(json.dumps({"error": f"未知命令: {command}"}))
        sys.exit(1) 