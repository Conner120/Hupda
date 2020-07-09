const { EnglishTokenizer, KeywordExtractor } = require("@agtabesh/keyword-extractor")
const documents = [
    'Austria will press ahead with a proposed tax on internet giants after plans for an European Union-wide levy fell through this week, Finance Minister Hartwig Loeger said on Friday.',
]

const tokenizer = new EnglishTokenizer()
const keywordExtractor = new KeywordExtractor()
keywordExtractor.setTokenizer(tokenizer)

// documents.forEach((text, i) => {
//     keywordExtractor.addDocument(i, text)
// })

const randomDocument = documents[Math.floor(Math.random() * documents.length)]
const keywords = keywordExtractor.extractKeywords(randomDocument, {
    sortByScore: true,
    limit: 10
})

console.log(keywords)