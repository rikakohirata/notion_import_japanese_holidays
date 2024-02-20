require("dotenv").config();

// Notion SDK for JavaScript
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

// Notion データベース ID
const databaseId = process.env.NOTION_PAGE_ID;

// 日本の祝日 API
const currentYear = new Date().getFullYear();
const holidaysUrl = `https://holidays-jp.github.io/api/v1/${currentYear}/date.json`;

async function fetchJapaneseHolidays() {
  try {
    // 祝日を取得
    const response = await fetch(holidaysUrl);
    const holidays = await response.json();

    let counts = 0;
    for (const [date, holiday] of Object.entries(holidays)) {
      // 指定のデータベースに祝日を追加
      await notion.pages.create({
        parent: {
          type: "database_id",
          database_id: databaseId,
        },
        properties: {
          Name: {
            title: [
              {
                type: "text",
                text: {
                  content: `\u{1F1EF}\u{1F1F5} ${holiday}`,
                },
              },
            ],
          },
          Date: {
            date: {
              start: date,
            },
          },
        },
      });
      counts++;
    }
    console.log(`success: ${counts}件追加しました`);
  } catch (error) {
    console.error(error);
  }
}

fetchJapaneseHolidays();
