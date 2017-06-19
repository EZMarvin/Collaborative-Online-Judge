import docker
import os
import shutil
import uuid

from docker.errors import *

client = docker.from_env()

IMAGE_NAME = 'ezhangmarvin/onlinejudge'
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMP_BUILD_DIR = '%s/temp' % CURRENT_DIR

SOURCE_FILE_NAMES = {
    "java" : "Example.java",
    'python' : 'example.py'
}

BINARY_NAMES = {
    "java" : "Example",
    'python' : 'example.py'
}

BUILD_COMMANDS = {
    "java" : "javac",
    "python" : "python"
}

EXECUTE_COMMANDS = {
    "java" : "java",
    "python" : "python"
}

def load_image():
    try:
        client.images.get(IMAGE_NAME)
    except ImageNotFound:
        print 'image not found locally, loading from docker hub'
        client.images.pull(IMAGE_NAME)
    except APIError:
        print 'image not found in docker hub'
        return
    print 'image: [%s] loaded' % IMAGE_NAME

def build_run(code, lang):
    result = {'build': None, 'run': None, 'error': None}
    source_file_dir = uuid.uuid4()
    source_file_host = '%s/%s' % (TEMP_BUILD_DIR, source_file_dir)
    source_file_guest = '/test/%s' % (source_file_dir)

    make_dir(source_file_host)

    with open('%s/%s' % (source_file_host, SOURCE_FILE_NAMES[lang]), 'w') as source_file:
        source_file.write(code)

    try:
        client.containers.run(
            image=IMAGE_NAME,
            command='%s %s' % (BUILD_COMMANDS[lang], SOURCE_FILE_NAMES[lang]),
            volumes={source_file_host: {'bind': source_file_guest, 'mode': 'rw'}},
            working_dir=source_file_guest
        )
        print 'source built'
        result['build'] = 'success !!'
    except ContainerError as e:
        print 'build failed'
        result['build'] = e.stderr
        shutil.rmtree(source_file_host)
        return result

    try:
        log = client.containers.run(
            image=IMAGE_NAME,
            command='%s %s' % (EXECUTE_COMMANDS[lang], BINARY_NAMES[lang]),
            volumes={source_file_host: {'bind': source_file_guest, 'mode': 'rw'}},
            working_dir=source_file_guest
        )
        print 'source executed'
        result['run'] = log
    except ContainerError as e:
        print 'Execute failed'
        result['run'] = e.stderr
        shutil.rmtree(source_file_host)
        return result

    shutil.rmtree(source_file_host)
    return result

def make_dir(dir):
    try: 
        os.mkdir(dir)
        print 'make new dir'
    except OSError:
        print 'make dir already exists'

