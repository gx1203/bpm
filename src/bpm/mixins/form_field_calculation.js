export default {
  data () {
    return {
      calculationTable: null,
      calculationResult: '',
      moreCalculationResultList: [],
      forIndex: null
    }
  },
  methods: {
    // 计算方式
    calculationMethods(arr, type) {
      if (type === 'max') {
        return Math.max.apply(null, arr)
      } else if (type === 'min') {
        return Math.min.apply(null, arr)
      } else if (type === 'sum') {
        return eval(arr.join('+'))
      } else if (type === 'avg') {
        const sum = eval(arr.join('+'))
        return (sum / arr.length * 100) / 100
      }
    },
    // 生成公式
    createMath(nodeTableLists, fieldId, type, rule) {
      if (nodeTableLists && nodeTableLists.length > 0) {
        nodeTableLists.forEach(table => {
          if (fieldId === table.id) {
            if (type === 'parent') {
              this.calculationTable = table
              this.calculationResult = ''
              console.log('parent', this.calculationTable)
              if (table.isCalculation === '1' && table.calculationDtos && table.calculationDtos.length > 0) {
                table.calculationDtos.forEach((item, index) => {
                  if (table.calculationDtos.length - 1 === index) {
                    item.operator = ''
                  }
                  this.getCalculationField(this.nodeData, item.fieldId, 'own', item) // 找公式内各字段
                })
              }
              if (table.fieldCalculations && table.fieldCalculations.length > 0) {
                for (let i = 0, len = table.fieldCalculations.length; i < len; i++) {
                  this.forIndex = null
                  this.getCalculationField(this.nodeData, table.fieldCalculations[i].parentFieldId, 'parent') // 找父级公式结果所在字段
                }
              }
            } else {
              console.log('own', table, rule.operator)
              let applyvalue = table.applyvalue + ''
              if (applyvalue && (/^\d+(.\d+)?$/.test(applyvalue.replace(/,/g, '')))) {
                applyvalue = applyvalue.replace(/,/g, '')
              }
              this.calculationResult += (Number(applyvalue) || 0) + (rule.operator || '')
              try {
                if (this.calculationResult) {
                  let calculationResult = eval(this.calculationResult)
                  if (calculationResult === Infinity) {
                    calculationResult = ''
                  }
                  this.$set(this.calculationTable, 'applyvalue', calculationResult.toString())
                  this.$set(this.calculationTable, 'showValue', calculationResult.toString())
                  if (this.calculationTable.inputType === 'double') {
                    if (this.calculationTable.applyvalue && this.calculationTable.applyvalue.indexOf(',') === -1) {
                      this.calculationTable.applyvalue = this.$options.filters.formatNumber(
                        this.calculationTable.applyvalue,
                        2,
                        1
                      )
                    }
                  }
                }
              } catch (e) {
              }
            }
            return
          }
          this.getCalculationField(table, fieldId, type, rule)
        })
      }
    },

    getCalculationField(node, fieldId, type, rule) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.getCalculationField(tab, fieldId, type, rule)
        })
      }
      let nodeTableLists = node.nodeTableLists
      if (this.isSubTable) {
        if (node.rows && node.rows[this.index]) {
          nodeTableLists = node.rows[this.index].nodeTableLists
        }
      }
      if (this.forIndex || this.forIndex === 0) {
        if (node.rows && node.rows[this.forIndex]) {
          nodeTableLists = node.rows[this.forIndex].nodeTableLists
        }
      }
      if (node.inputType === 'subtable' && node.rows && node.rows.length > 0) {
        if (nodeTableLists && nodeTableLists.length > 0 && nodeTableLists.map(item => item.id).includes(fieldId)) {
          if (type === 'parent') {
            node.rows.forEach((item, index) => {
              console.log(item)
              this.forIndex = index
              this.createMath(item.nodeTableLists, fieldId, type, rule)
              // 计算结果在子表 会有多个计算结果  考虑多个子表
            })
            return
          } else {
            if (!this.forIndex && this.forIndex !== 0) {
              const calculationData = node.rows.map(item => {
                let applyvalue = (item.nodeTableLists.find(val => val.id === fieldId).applyvalue || 0) + ''
                if (applyvalue && (/^\d+(.\d+)?$/.test(applyvalue.replace(/,/g, '')))) {
                  applyvalue = applyvalue.replace(/,/g, '')
                }
                return Number(applyvalue)
              })
              const nodeTableLists2 = JSON.parse(JSON.stringify(nodeTableLists)) 
              this.$set(nodeTableLists2.find(val => val.id === fieldId), 'applyvalue', this.calculationMethods(calculationData, rule.method))
              this.createMath(nodeTableLists2, fieldId, type, rule)
              return
            }
          }
        }
      }
      this.createMath(nodeTableLists, fieldId, type, rule)
    },

    isCalculation(item) {
      if (
        item.inputType === 'number' ||
        item.inputType === 'double'
      ) {
        console.log(item);
        // console.log(this.nodeData)
        const applyvalue =
          item.inputType === 'double'
            ? Number(
              this.$options.filters.delcommafy(item.applyvalue)
            ).toFixed(2)
            : item.applyvalue
        if (item.fieldCalculations && item.fieldCalculations.length > 0) {
          for (let i = 0, len = item.fieldCalculations.length; i < len; i++) {
            this.forIndex = null
            this.getCalculationField(this.nodeData, item.fieldCalculations[i].parentFieldId, 'parent') // 找父级公式结果所在字段
            // if (this.calculationResult) {
            //   let calculationResult = eval(this.calculationResult)
            //   console.log(this.calculationResult)
            //   this.$set(this.calculationTable, 'applyvalue', calculationResult.toString())
            //   this.$set(this.calculationTable, 'showValue', calculationResult.toString())
            //   if (this.calculationTable.inputType === 'double') {
            //     if (this.calculationTable.applyvalue && this.calculationTable.applyvalue.indexOf(",") === -1) {
            //       this.calculationTable.applyvalue = this.$options.filters.formatNumber(
            //         this.calculationTable.applyvalue,
            //         2,
            //         1
            //       );
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
}
