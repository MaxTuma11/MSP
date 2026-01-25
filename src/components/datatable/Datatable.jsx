import React from 'react'
import './Datatable.css'

const Datatable = () => {

    const manifestos = [
        {
            id: 1,
            name: "Labour Party",
            url: "https://labour.org.uk/wp-content/uploads/2024/06/Change-Labour-Party-Manifesto-2024-large-print.pdf"
        },
        {
            id: 2,
            name: "Conservative Party",
            url: "https://public.conservatives.com/publicweb/GE2024/Accessible-Manifesto/Accessible-PDF-Conservative-Manifesto-2024.pdf"
        },
        {
            id: 3,
            name: "Liberal Democrat Party",
            url: "https://www.libdems.org.uk/fileadmin/groups/2_Federal_Party/Documents/PolicyPapers/Manifesto_2024/For_a_Fair_Deal_-_Liberal_Democrat_Manifesto_2024.pdf"
        },
        {
            id: 4,
            name: "Scottish National Party",
            url: "https://s3-eu-west-2.amazonaws.com/www.snp.org/uploads/2024/06/2024-06-20b-SNP-General-Election-Manifesto-2024_interactive.pdf"
        },
        {
            id: 5,
            name: "Green Party",
            url: "https://greenparty.org.uk/app/uploads/2024/06/Green-Party-2024-General-Election-Manifesto-Long-version-with-cover.pdf"
        },
        {
            id: 6,
            name: "Reform UK",
            url: "https://assets.nationbuilder.com/reformuk/pages/253/attachments/original/1718625371/Reform_UK_Our_Contract_with_You.pdf?1718625371"
        },
        {
            id: 7,
            name: "Plaid Cymru",
            url: "https://assets.nationbuilder.com/plaid2016/pages/10962/attachments/original/1718214059/Plaid_Cymru_Maniffesto_2024_ENGLISH.pdf?1718214059"
        },
        {
            id: 8,
            name: "Sinn Fein",
            url: "https://vote.sinnfein.ie/wp-content/uploads/2024/06/Sinn-Fein-Westminster-Election-Manifesto-2024.pdf"
        },
        {
            id: 9,
            name: "Alliance Party",
            url: "https://www.allianceparty.org/2024_westminster_manifesto"
        },
        {
            id: 10,
            name: "Democratic Unionist Party",
            url: "https://s3.eu-west-1.amazonaws.com/my-dup/2024-Manifesto-Final.pdf"
        },
        {
            id: 11,
            name: "Ulster Unionist Party",
            url: "https://cain.ulster.ac.uk/issues/politics/docs/uup/uup_2024-07-04_ge_man.pdf"
        },
        {
            id: 12,
            name: "Social Decomratic and Labour Party",
            url: "https://assets.nationbuilder.com/sdlp/pages/753/attachments/original/1719422488/SDLP_Manifesto_2024.pdf"
        },
        {
            id: 13,
            name: "Traditional Unionist Voice",
            url: "https://tuv.org.uk/wp-content/uploads/2024/06/Proof2.pdf"
        },
        {
            id: 14,
            name: "Public Whip Dataset",
            url: "https://www.publicwhip.org.uk/project/data.php"
        },
        {
            id: 15,
            name: "electiondatavault Dataset",
            url: "https://electiondatavault.co.uk/tables/polling/vi-polls/"
        }
    ]

  return (
    <div className="data-sources">
        <h1>Data Sources</h1>
        <p>
            This project aims to be as transparent as possible with where the data is coming from and how it is being used.
            Because of that, all of the manifestos used for summarisation and word analysis are linked below.
            This also provides anyone using the website with a complete and factual view of the manifesto that has not been summarised in any way.
            Additionally, data used for party statistics, such as the attendance and rebellion rates, is linked below so you can explore their data as well.
            It is also very important to note when this data was collected. Even though manifestos do not change often, party statistics do.
            The data other than manifestos is collected daily.
        </p>
        <table className="manifesto-table">
        <thead>
          <tr>
            <th>Manifesto/Dataset Name</th>
            <th>Data URL</th>
          </tr>
        </thead>
        <tbody>
          {manifestos.map((manifesto) => (
            <tr key={manifesto.id}>
              <td>{manifesto.name}</td>
              <td>
                <a
                  href={manifesto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Data Source
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Datatable
