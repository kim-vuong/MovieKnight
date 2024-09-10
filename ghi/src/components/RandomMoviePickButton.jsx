import { Button, Flex, message } from 'antd';

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('BASE_URL is not defined')
}

export default function GetRandomMoviePick({movieNightId}) {
    const [messageApi, contextHolder] = message.useMessage();


    const handleClick = () =>{
        fetchData()
    };

    const fetchData = async()=>{
        const moviePicksUrl = `${API_HOST}/api/movie-picks/random/${movieNightId}`
        const moviePickResponse = await fetch(moviePicksUrl)

        if(!moviePickResponse.ok){
            throw new Error(
                `Bad server response: ${moviePickResponse.status}`
            );
        }
        try {
            const pickData = await moviePickResponse.json()

            console.log(pickData.title)

            messageApi.open({
                type: 'success',
                content: `Your Random Movie Pick is ${pickData.title}!`,
                duration: 10,
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                    fontWeight: 600,
                    fontSize: 25
                }
            })
        } catch (error) {
            console.error("Empty Movie Pick List Error", error)
            messageApi.open({
                type : 'error',
                content: `Your Movie Night has no Movie Picks!`,
                duration: 10,
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                    fontWeight: 600,
                    fontSize: 25
                }
            })
        }
    }


    return(
        <>
            <Flex gap="small" wrap>
                <Button onClick={handleClick} type="primary">Random Movie</Button>
            </Flex>
            {contextHolder}
        </>
    )
}
