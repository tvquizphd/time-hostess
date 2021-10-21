import { applyGuide } from '../../lib/guide'
import withApollo from '../../lib/withApollo'
import Page from '../components/page'
import process from 'process'
import dotenv from 'dotenv'
import { useRouter } from 'next/router'

const staticRegenerationError = (message) => {
  this.message = message
  this.name = 'staticRegenerationError'
}

const impossibleRouteMessage = (slug) => {
  return `No route possible for /${slug.join('/')}`
}

const switchFirst = (slug) => {
  switch(slug[0]) {
    case 'tree':
      return Page
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(slug)
      )
  }
}

const switchRoot = (slug) => {
  switch(slug.length) {
    case 0:
      return Page
    case 1:
      return switchFirst(slug)
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(slug)
      )
  }
}

export const getStaticPaths = () => {
  return {
    paths: [
      {
        params: { slug: [] },
        locale: 'en-US',
      },
      {
        params: { slug: ['tree'] },
        locale: 'en-US',
      }
    ],
    fallback: "blocking"
  }
}

const makePropsDefault = (body) => {
  return {
    body,
    SECRET: null
  }
}

export const getStaticProps = async (context) => {

	const revalidate = 60
  const { locale, params } = context

  // Handle ISR of invalid pages
  try {
    const slug = params.slug || []
    switchRoot(slug)
  }
  catch {
    return {
      notFound: true,
      revalidate
    }
  }

  // Load environment
	const {error} = dotenv.config()
	if (error) {
    throw new staticRegenerationError(
      `Cannot load .env at ${error.path}`
    )
	}
	console.log(`Loaded .env`)
	const { SECRET } = process.env

  // Run html page through all of the guides
  const root = applyGuide('./static/index.html')
  const body = root.children[1].children[1]
  body.tagName = "div"

  return {
    props: {
      ...makePropsDefault(body),
      SECRET: SECRET || null
    },
    revalidate
  }
}

const Index = (props) => {
  const router = useRouter()
  const slug = router.query.slug || []

  // Render any component given by switchRoot
  const Component = switchRoot(slug)
  return <Component {...props}/>
}

// ssr: false, instead ssg + preval + isr
export default withApollo({ ssr: false })(Index)