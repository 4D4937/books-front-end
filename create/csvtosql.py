# ===== 在下方添加你的文本，每行一个 =====
TEXTS = """
https://liberpdf.top/2635696
https://liberpdf.top/242939
https://liberpdf.top/1126296
https://liberpdf.top/3650740
https://liberpdf.top/1556653
https://liberpdf.top/499653
https://liberpdf.top/60884
https://liberpdf.top/4600207
https://liberpdf.top/2094769
https://liberpdf.top/809537
https://liberpdf.top/4691832
https://liberpdf.top/3678717
https://liberpdf.top/375299
https://liberpdf.top/4716908
https://liberpdf.top/1134293
https://liberpdf.top/2840261
https://liberpdf.top/4476682
https://liberpdf.top/3269883
https://liberpdf.top/4799795
https://liberpdf.top/4818227
https://liberpdf.top/191671
https://liberpdf.top/1649622
https://liberpdf.top/1987516
https://liberpdf.top/1073359
https://liberpdf.top/3869356
https://liberpdf.top/3118855
https://liberpdf.top/1063228
https://liberpdf.top/4635881

""".strip().split('\n')
# ===== 文本结束 =====

import pyperclip
import time
from pynput import keyboard

def monitor_clipboard():
    current_index = 0
    last_clipboard = pyperclip.paste()
    
    # 复制第一条文本到剪贴板
    pyperclip.copy(TEXTS[current_index])
    print(f"当前文本 ({current_index + 1}/{len(TEXTS)}): {TEXTS[current_index]}")

    def on_press(key):
        nonlocal current_index, last_clipboard
        
        # 检测到 Ctrl+V
        if key == keyboard.Key.ctrl_l or key == keyboard.Key.ctrl_r:
            time.sleep(0.1)  # 稍微等待一下，确保粘贴动作完成
            current_clipboard = pyperclip.paste()
            
            # 如果检测到文本被粘贴（剪贴板内容改变）
            if current_clipboard != last_clipboard:
                if current_index < len(TEXTS) - 1:
                    current_index += 1
                    pyperclip.copy(TEXTS[current_index])
                    print(f"已切换 ({current_index + 1}/{len(TEXTS)}): {TEXTS[current_index]}")
                else:
                    print("全部完成!")
                    return False  # 停止监听
                    
            last_clipboard = current_clipboard

    # 开始监听键盘
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

if __name__ == "__main__":
    print(f"共加载 {len(TEXTS)} 条文本")
    print("开始监听，按Ctrl+V粘贴后会自动切换下一条...")
    monitor_clipboard()