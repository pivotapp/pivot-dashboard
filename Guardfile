#!/usr/bin/env python

from livereload.task import Task
from livereload.compiler import shell

Task.add('views')
Task.add('components/mvanasse-shoelace', shell('touch public/stylesheets/index.styl'))
Task.add('public', shell('make build'))
