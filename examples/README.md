install thrift binary on macOS with [brew](https://formulae.brew.sh/formula/thrift)

to generate code

```sh
cd ./examples
thrift -version  # Thrift version 0.13.0
thrift -r --gen js:node unpkg.thrift
```
