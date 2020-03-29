export const enum RemainStat {
  PLENTY = 'plenty',
  SOME = 'some',
  FEW = 'few',
  EMPTY = 'empty',
  BREAK = 'break'

}

// 재고 상태[100개 이상(녹색): 'plenty'
// / 30개 이상 100개미만(노랑색): 'some'
// / 2개 이상 30개 미만(빨강색): 'few'
// / 1개 이하(회색): 'empty' / 판매중지: 'break']
