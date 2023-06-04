import { API_PATH, ELEMENT_LIST_SEARCH } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import './OperationHistory.scss';

function OperationHistory() {
  return (
    <div className="history-root">
      <MainWrapper title="操作履歴">
        <TableLayout
          tableApiLink={API_PATH.ADMIN_HISTORY}
          listKeyName={{
            names: ['操作', '操作日時', '操作内容', '作業者'],
            keys: [
              { keyName: 'operation', sorter: false },
              { keyName: 'date_time', sorter: false },
              { keyName: 'document_name', sorter: false },
              { keyName: 'operator', sorter: false },
            ],
          }}
          searchList={[
            { label: '操作', key: 'operation', type: ELEMENT_LIST_SEARCH.INPUT },
            { label: '企業名', key: 'company', type: ELEMENT_LIST_SEARCH.SELECT },
            { label: '作業者', key: 'operator', type: ELEMENT_LIST_SEARCH.INPUT },
            {
              label: ['作業日', ''],
              key: ['start_date', 'end_date'],
              type: ELEMENT_LIST_SEARCH.RANGE_DATE,
              disabledRangeDates: [false, false],
            },
          ]}
          tableTitle="履歴"
          isHiddenRowSelection={true}
        />
      </MainWrapper>
    </div>
  );
}

export default OperationHistory;
