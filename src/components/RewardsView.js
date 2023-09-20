import React, {useState, useEffect, Fragment} from "react";
import { MaterialReactTable } from 'material-react-table';
import rewardPointsCalculate from "./rewardsCalculator";
import data from "../api/data";

function RewardsView () {
    const [loadedData, setloadedData] = useState({});
    const [userRewards, setCalcRewards] = useState({});
    const [userTransactions, setUserTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        setloadedData({ ...data });
        setUsers([...Object.keys(data)]);

    }, []);

    const userSelect = (value) => {
        setCurrentUser(value);
        let userData = loadedData[value];

        let monthT = {
            7: {
                amounts: [],
                rewards: 0,
            },
            8: {
                amounts: [],
                rewards: 0,
            },
            9: {
                amounts: [],
                rewards: 0,
            },
        };
        for (let i = 0; i < userData.length; i++) {
            let month = new Date(userData[i]['date']);
            console.log("month-->",month.getMonth())
            if (month.getMonth() + 1 == 7 || month.getMonth() + 1 == 8 || month.getMonth() + 1 == 9) {
                monthT[month.getMonth() + 1]['amounts'].push(userData[i]['amount']);
            }
        }
        for (let key in monthT) {
            let total_month_rewards = 0;
            for (let i = 0; i < monthT[key]['amounts'].length; i++) {
                let price = monthT[key]['amounts'][i];
                total_month_rewards = total_month_rewards + rewardPointsCalculate(price);
            }
            monthT[key]['rewards'] = total_month_rewards;
        }
        setCalcRewards({ ...monthT });
        setUserTransactions(userData.map((item)=> {
            return {
                date: item["date"],
                amount: item["amount"],
                reward: rewardPointsCalculate(item["amount"])
            }
        }))
    };

    const columnsTransactions = [
        {
            accessorKey: 'date',
            header: 'Date',
            size: 50,
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            size: 50,
        },
        {
            accessorKey: 'reward',
            header: 'Rewards',
            size: 50,
        },
    ];
    return (
        <div style={{
            marginTop: "20px",
            marginBottom: "50px",
            fontSize: "20px",
        }}>
            <h2 style={{ textAlign: "center" }}>User Rewards Dashborad</h2>
            <div className="select-style">
                <select onChange={e => userSelect(e.target.value)} value={currentUser} >
                    <option value="" disabled>Select User</option>
                    {users.map((item, index) => {
                        return (
                            <option key={index} value={item}> {item.toUpperCase()} </option>
                        );
                    })}
                </select>
            </div>

            {Object.keys(userRewards).length > 0 &&
                <Fragment>
                    <table className="customers">
                        <thead>
                        <tr>
                            <th>Month</th>
                            <th>Rewards</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>July Month</td>
                            <td>{userRewards[7]["rewards"]}</td>
                        </tr>
                        <tr>
                            <td>August Month</td>
                            <td>{userRewards[8]["rewards"]}</td>
                        </tr>
                        <tr>
                            <td>September Month</td>
                            <td>{userRewards[9]["rewards"]}</td>
                        </tr>
                        <tr>
                            <td>Total Reward</td>
                            <td>{userRewards[7]["rewards"] + userRewards[8]["rewards"] + userRewards[9]["rewards"]}</td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>User Transactions</h4>
                    <MaterialReactTable columns={columnsTransactions} data={userTransactions} />
                </Fragment>
            }




        </ div >
    );
}

export default RewardsView;

