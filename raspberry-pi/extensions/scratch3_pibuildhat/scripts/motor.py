import sys
from buildhat import Motor
from buildhat import Hat
import json

def handle_motor(device_no):
    def _handle_motor(speed, pos, apos):
        data = json.dumps({
            "type": "data",
            "no": device_no,
            "sensors": {
                "speed": speed,
                "pos": pos,
                "apos": apos
            }
        })
        sys.stdout.write(data + "\n")

    return _handle_motor


# エントリポイント
if __name__ == '__main__':
    hat = Hat()

    # Motorが接続されているポートを調べてMotorのインスタンスを作成
    connected_devices = hat.get()
    motors = {}
    device_nos = ['A', 'B', 'C', 'D']
    connected_ports = []
    for device_no in device_nos:
        if connected_devices[device_no]['connected'] and connected_devices[device_no]['name'] == 'Motor':
            motors[device_no] = Motor(device_no)
            motors[device_no].when_rotated = handle_motor(device_no)
            motors[device_no].release = False
            connected_ports.append(device_no)

    sys.stdout.write(json.dumps({
        "type": "status",
        "status": "ready",
        "connected_ports": connected_ports,
    }) + "\n")
    # 標準入力からJSON形式でコマンドを受け取る無限ループ
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                sys.stderr.write("No input\n")
                continue
            data = json.loads(line)
            motor_no = data['motor_no']
            motor = motors[motor_no]
            command = data['command']
            params = data['params']

            if command == "run_for_degrees":
                motor.run_for_degrees(params[0], speed=params[1])
            elif command == "run_for_seconds":
                motor.run_for_seconds(params[0], speed=params[1])
            elif command == "run_for_rotations":
                motor.run_for_rotations(params[0], speed=params[1])
            elif command == "run_to_position":
                motor.run_to_position(params[0], speed=params[1])
            elif command == "start":
                motor.start(speed=params[0])
            elif command == "stop":
                motor.stop()
        except Exception as e:
            sys.stderr.write(f"{e}\n")
