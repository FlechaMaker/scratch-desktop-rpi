# コマンドライン引数としてモーターの回転コマンドを受け取る
# 引数の形式は、"コマンド モーター番号 引数1 引数2..." とする
# 例: python3 motor-run.py A -100 5

from buildhat import Motor
import sys

# エントリポイント
if __name__ == '__main__':
    if len(sys.argv) < 5:
        print("Usage: python motor-run.py [command] [motor] [param1] [param2]...")
        sys.exit(1)

    command = sys.argv[1]
    motor_no = sys.argv[2]
    params = []
    # paramsの数だけ引数を取得
    for i in range(3, len(sys.argv)):
        params.append(float(sys.argv[i]))

    motor = Motor(motor_no)
    if not motor.connected:
        print(f"Motor ${motor_no} is not connected.")
        sys.exit(1)

    if command == "run_for_degrees":
        motor.run_for_degrees(params[0], speed=params[1])
    elif command == "run_for_seconds":
        motor.run_for_seconds(params[0], speed=params[1])
    elif command == "run_for_rotations":
        motor.run_for_rotations(params[0], speed=params[1])
    elif command == "run_to_position":
        motor.run_to_position(params[0], speed=params[1])
    elif command == "start":
        motor.start(params[0])
    elif command == "stop":
        motor.stop()

    sys.exit(0)
