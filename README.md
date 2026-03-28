# @keychord/chords-jetbrains

Chord package for JetBrains IDEs.

## Supported Apps

- IntelliJ IDEA
- TODO

## API

### buildJetbrainsHandler(meta, idePath)

Builds a handler that calls the IDE executable's `ideScript` subcommand.

#### meta

Type: `ImportMeta`

`import.meta` should be the first argument.

#### idePath

Type: `string`

The path to the IDE application. Supports `~` to refer to `$HOME`.
