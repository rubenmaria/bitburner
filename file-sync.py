import json
import os
import time
from websocket_server import WebsocketServer


PORT = 9001
BITBURNER_DIRETORY = "code"
LOCAL_DIRECTORY = "dist"


class MessageIndex(object):
    _index = None
    def __new__(cls):
        if not cls._index:
            cls._index = super(MessageIndex, cls).__new__(cls)
            cls._index = int(0)
            return cls._index
        assert isinstance(cls._index, int)
        return cls._index + 1


def main():
    server = WebsocketServer(port = PORT)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    server.set_fn_message_received(message_received)
    server.run_forever(True)
    print("Server started succesfully!")
    wait_for_bitburner_connection(server)
    command_loop(server)


def wait_for_bitburner_connection(server: WebsocketServer):
    print("waiting for Bitburner to connect...")
    while len(server.clients) < 1:
        time.sleep(1)


def command_loop(server: WebsocketServer):
    while True:
        command = input("Enter command> ")
        execute_command(command, server)


def execute_command(command: str, server: WebsocketServer):
    bitburner_client = server.clients[0]
    if command == "sync":
        upload_directory(server, bitburner_client, LOCAL_DIRECTORY)
    elif command == "quit":
        server.shutdown()
    else:
        print_help()


def print_help():
    print(
    """
    help Commands: 
        sync: Uploads files in the src directory
        quit: Stops server
    """
    )


def new_client(client: dict, server: WebsocketServer):
    print(f"Connected to Bitburner, with id: {client["id"]}!")
    server.deny_new_connections()


def client_left(client: dict, _):
	print("Client(%d) disconnected" % client['id'])


def message_received(_: dict, server: WebsocketServer, message: str):
    response = json.loads(message)
    result = response["result"]
    if result != "OK":
        server.shutdown_abruptly()
        raise ConnectionAbortedError(f"Invalid Respones {result}")


def upload_directory(server: WebsocketServer, client: dict, directory: str):
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        file_path = os.path.join(directory, filename)
        bitburner_path = os.path.join(BITBURNER_DIRETORY, filename)
        upload_file(server, client, file_path, bitburner_path)
    print("Succesfully uploaded files")
 

def upload_file(
    server: WebsocketServer,
    client: dict,
    file_path: str,
    bitburner_path: str
):
    with open(file_path) as file_handle:
        push_file = {
            "jsonrpc": "2.0",
            "id": MessageIndex(),
            "method": "pushFile",
            "params": {
                "filename": bitburner_path,
                "content": file_handle.read(),
                "server": "home",
            }
        }
        server.send_message(client, json.dumps(push_file))


if __name__ == '__main__':
    main()


