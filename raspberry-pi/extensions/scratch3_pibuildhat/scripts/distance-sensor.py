# 超音波センサーの検出距離を標準出力に出力する
# センサーのポートを引数として受け取る

from buildhat import DistanceSensor
import sys

# エントリポイント
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python distance-sensor.py [port]")
        sys.exit(1)

    port = sys.argv[1]

    dist = DistanceSensor(port)

    print(dist.get_distance())