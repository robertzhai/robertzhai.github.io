---
layout: post
title:  "bigdata-hadoop-2.8-python-mapreduce-wordcount(2)"
date:   2017-6-23 20:30:0 +0800
categories: bigdata
---


# mapper map.py

    #!/usr/bin/env python
    import sys
    
    def read_inputs(file):  
      for line in file:
        line = line.strip()
        yield line.split()
    def main():  
      file = sys.stdin
      lines = read_inputs(file)
    
      for words in lines:
        # print words
        for word in words:
          print("{}\t{}".format(word, 1))
    if __name__ == "__main__":  
      main()
      
# reducer reduce.py

    #!/usr/bin/env python
    import sys
    
    def read_map_outputs(file):  
      for line in file:
        # print line
        yield line.strip().split("\t", 1)
    
    def main():  
      current_word = None
      word_count   = 0
      lines = read_map_outputs(sys.stdin)
      for word, count in lines:
        try:
          count = int(count)
        except ValueError:
          continue
        if current_word == word:
          word_count += count
        else:
          if current_word:
            print("{}\t{}".format(current_word, word_count))
          current_word = word
          word_count = count
      if current_word:
        print("{}\t{}".format(current_word, word_count))
    if __name__ == "__main__":  
      main()
 
      
# pipe test map reduce
    echo "test a b c abc \ndef a h" | python python/map.py | sort -k1|  python python/reduce.py
# streaming 提交运行 job 

    bin/hadoop jar share/hadoop/tools/lib/hadoop-streaming-2.8.0.jar \
    -input wd_data -output wd_data_output -mapper python/wordcount/map.py \
    -reducer python/wordcount/reduce.py
    

# 下载hdfs运行结果到本地

    hadoop -get /user/username/wd_data_output python/wordcount
    
    
# 代码和测试用例和结果
    
* [https://github.com/robertzhai/hadoop-practice](https://github.com/robertzhai/hadoop-practice)