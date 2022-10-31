import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

// localhost:3000/createArticle -> they are a user (they can create an article)

const CreateArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    // this variable save the title and content of CreateArticle once we create the article by clicking the Create Article button using: useState
    const initialState = {
        // inputs:
        title: "",
        content: ""
    }

    const [articleData, setArticleData] = useState(initialState);

    // Generic handleChange
    // Whenever the input get changed (ex. title or content is midified) = access to the event coming from the handleChange 
    const handleChange = (e: any) => {
        // setArticleDate({take all the current values properties in articleDate, then [trigger event.target.name] : meke it equal to the current value})
        setArticleData({ ...articleData, [e.target.name]: e.target.value })
    }

    const createArticle = async () => {
        try {
            // Define things we are going to recive from the SuperbaseClient
            const { data, error } = await supabaseClient
                .from("articles")
                .insert([
                    {
                        title: articleData.title,
                        content: articleData.content,
                        user_email: user?.email?.toLowerCase(),
                        user_id: user?.id
                    }
                ])
                .single()
            if (error) throw error;

            // setting everything back to empty string (good practice to clean cache memory)
            setArticleData(initialState);

            router.push("/mainFeed");
        } catch (error: any) {
            alert(error.message);
        }
    }

    console.log(articleData);
    return (
        <Grid.Container gap={1}>
            <Text h3>Title</Text>
            <Grid xs={12}>
                <Textarea
                    name="title"
                    aria-label="title"
                    placeholder="Article Title"
                    fullWidth={true}
                    rows={1}
                    size="xl"
                    onChange={handleChange}
                />
            </Grid>
            <Text h3>Article Text</Text>
            <Grid xs={12}>
                <Textarea
                    name="content"
                    aria-label="content"
                    placeholder="Article Text"
                    fullWidth={true}
                    rows={6}
                    size="xl"
                    onChange={handleChange}
                />
            </Grid>
            <Grid xs={12}>
                <Text>Posting as {user?.email}</Text>
            </Grid>
            <Button onPress={createArticle}>Create Article</Button>
        </Grid.Container>
    )
}

export default CreateArticle;

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });