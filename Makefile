synxroform:
	cd ./quickstart && hugo -d "../synxroform.github.io"
	cd ./synxroform.github.io && git add . && git commit -m "update files" && git push origin master
