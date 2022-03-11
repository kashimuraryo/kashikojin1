import { useState, useEffect }  from 'react';
import { db } from '../../firebase';
import CommonDialog from '../CommonDialog';
import DateSelector from '../DateSelector'
import { doc, getDocs, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { Button, TextField, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles
} from '@material-ui/core'
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const useStyle = makeStyles((theme) => ({
  amount: {
    textAlign: 'right',
  },
  textRed: {
    color: 'red',
  },
}));

type House = {
  docId: string;
  type: string;
  content: string;
  amount: number;
  timestamp: string;
};

type ChartPropety = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
};

type ChartMonthPropety = {
  month: string;
  expenditure: number;
  income: number;
};

function HouseholdAccountbook() {
  const classes = useStyle();
  const [houseList, setHouseList] = useState<House[]>([]);
  const [houseText, setHouseText] = useState<string>('');
  const [houseAmount, setHouseAmount] = useState<string>('0');
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);
  const [comboItem , setComboItem] = useState('0');
  const [timestamp, setTimestamp] = useState(new Date());
  const [chartDataList, setChartDataList] = useState<ChartPropety[]>([]);  // チャート情報(データ単位)
  const [chartMonthList, setChartMonthList] = useState<ChartMonthPropety[]>([]);  // チャート情報(月単位)
  const [errMsgText, setErrMsgText] = useState<string>('');
  const [errMsgAmount, setErrMsgAmount] = useState<string>('');
  const [deleteDocId, setDeleteDocId] = useState<string>('');

  // 表示
  const dispData = () => {
    const houseCollectionRef = collection(db, 'tHouseholdAccountbook');
    getDocs(houseCollectionRef).then((querySnapshot) => {
      const userList: House[] = [];
      const wkchartDataList: ChartPropety[] = [];
      const wkchartMonthList: ChartMonthPropety[] = [];
      let count: number = 0;
      querySnapshot.docs.map((doc, index) => {
        const task: House = {
          docId: doc.id,
          type: doc.data().type.toString(),
          content: doc.data().content,
          amount: doc.data().amount,
          timestamp: doc.data().timestamp,
        };
        userList.push(task);
        count += 1;

        console.log(doc.data());

        // チャート情報(データ単位)へ追加
        wkchartDataList.push(
          {
            name: doc.data().timestamp,
            uv: doc.data().amount,
            pv: 1000,
            amt: 3000,
          }
        );

        // チャート情報(月単位)へ追加
        // ここでwkchartDataListをループして、月単位で支出/収入を保持する
        let addFlg: boolean = false;  // true:既に年月のkeyがある false:年月のkeyがない
        let wkIndex: number = 0;
        for (let i = 0; i < wkchartMonthList.length; i++) {
          if (wkchartMonthList[i].month.substring(0, 7) === doc.data().timestamp.substring(0, 7)) {
            addFlg = true;
            wkIndex = i;
          }
        };

        if (addFlg === true) {
          if (doc.data().type.toString() === '0') {
            // 支出
            wkchartMonthList[wkIndex].expenditure = wkchartMonthList[wkIndex].expenditure + doc.data().amount;
          } else {
            // 収入
            wkchartMonthList[wkIndex].income = wkchartMonthList[wkIndex].income + doc.data().amount;
          }
        } else {
          if (doc.data().type.toString() === '0') {
            // 支出
            wkchartMonthList.push(
              {
                month: doc.data().timestamp.substring(0, 7),
                expenditure: doc.data().amount,
                income: 0,
              }
            );
          } else {
            // 収入
            wkchartMonthList.push(
              {
                month: doc.data().timestamp.substring(0, 7),
                expenditure: 0,
                income: doc.data().amount,
              }
            );
          }
        }
      });

      wkchartMonthList.sort(function(a, b): number {
        if (a.month > b.month) return 1;
        if (a.month < b.month) return -1;
        return -1;
      });

      setHouseList(userList);
      setChartDataList(wkchartDataList);
      setChartMonthList(wkchartMonthList);
    });
  };

  // 数値チェック
  function isNumeric(val: string) {
    return /^-?\d+$/.test(val);
  }

  // 登録
  const addTask = (type: string, inputText: string, inputAmount: string, timestamp: Date)  => {
    let errMsg: string = '';

    setErrMsgText('');
    setErrMsgAmount('');
    
    if (inputText === '' || inputAmount === '' || isNumeric(inputAmount) === false) {
      if (inputText === '' ) {
        errMsg = errMsg + '内容を入力してください';
        setErrMsgText(errMsg);
      };
      if (inputAmount === '' || isNumeric(inputAmount) === false) {
        if (inputAmount === '') {
          errMsg = '金額を入力してください';
          setErrMsgAmount(errMsg);
        } else {
          errMsg = '金額は半角数字を入力してください';
          setErrMsgAmount(errMsg);
        };
      };
      return;
    }

    const houseCollectionRef = collection(db, 'tHouseholdAccountbook');
    const documentRef = addDoc(houseCollectionRef, {
      type: type,
      content: inputText,
      amount: Number(inputAmount),
      timestamp: `${timestamp.getFullYear()}/${(timestamp.getMonth()+1).toString().length <= 1 ? '0' + (timestamp.getMonth()+1) : timestamp.getMonth()+1}/${timestamp.getDate().toString().length <= 1 ? '0' + timestamp.getDate() : timestamp.getDate()}`,
    });
    
    setHouseText('');
    setHouseAmount('0');
    dispData();
  };

  // 削除(確認)
  const deleteTaskConfirm = (docId: string) => {
    setDeleteDocId(docId);
    setIsOpenDeleteConfirm(true);
  };

  // 削除
  const deleteTask = async() => {
    setIsOpenDeleteConfirm(false);
    const userDocumentRef = doc(db, 'tHouseholdAccountbook', deleteDocId);
    await deleteDoc(userDocumentRef);
    dispData();
  };

  // 支出/収入コンボボックス切替時
  const handleChange = (event: SelectChangeEvent) => {
    setComboItem(event.target.value);
  };

  // 初期処理
  useEffect(() => {
    dispData();
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>
                支出 / 収入
              </TableCell>
              <TableCell>
                年月日
              </TableCell>
              <TableCell>
                内容
              </TableCell>
              <TableCell>
                金額
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {houseList.map((house, index) => (
              <>
                <TableRow key={index.toString()}>
                  <TableCell>
                    {house.type === '0' ? '支出' : '収入'}
                  </TableCell>
                  <TableCell>
                    {house.timestamp}
                  </TableCell>
                  <TableCell>
                    {house.content}
                  </TableCell>
                  <TableCell>
                    {house.amount.toString()}円
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteTaskConfirm(house.docId)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        fixedWidth
                      />
                    </Button>
                  </TableCell>
                </TableRow>
                <CommonDialog
                  msg="この記録を削除しますか？"
                  isOpen={isOpenDeleteConfirm}
                  doYes={deleteTask}
                  doNo={() => {setIsOpenDeleteConfirm(false)}}
                />
              </>
            ))}
            <TableRow>
              <TableCell>
                <Select
                  value={comboItem}
                  onChange={handleChange}
                  displayEmpty
                > 
                  <MenuItem value={0}>支出</MenuItem>
                  <MenuItem value={1}>収入</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <DateSelector
                  timestamp={timestamp}
                  setTimestamp={setTimestamp}
                />
              </TableCell>
              <TableCell>
                <Typography className={classes.textRed}>{errMsgText}</Typography>
                <TextField
                  value={houseText}
                  label="支出/収入の内容を入力"
                  variant="standard" 
                  size="small"
                  fullWidth
                  onChange={(e) => {setHouseText(e.target.value)}}
                />
              </TableCell>
              <TableCell>
              <Typography className={classes.textRed}>{errMsgAmount}</Typography>
              <TextField
                  value={houseAmount}
                  label="金額を入力"
                  variant="standard" 
                  className={classes.amount}
                  size="small"
                  fullWidth
                  onChange={(e) => {setHouseAmount(e.target.value)}}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => addTask(comboItem, houseText, houseAmount, timestamp)}
                >
                  ＋
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <LineChart width={700} height={300} data={chartMonthList} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type='monotone' dataKey='expenditure' stroke='#8884d8' />
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
      </LineChart>

      <LineChart width={700} height={300} data={chartMonthList} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type='monotone' dataKey='income' stroke='#8884d8' />
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
}

export default HouseholdAccountbook;
